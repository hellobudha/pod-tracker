// Best-effort Nespresso US (USD) Vertuo price lookup.
//
// IMPORTANT: Nespresso has no public API. This scrapes public product pages and
// is inherently fragile — page structure changes or bot-protection can break it.
// The function NEVER throws to the client: on any failure it returns
// { results: {...nulls}, degraded: true } so the UI just omits prices.

const LISTING_URLS = [
  'https://www.nespresso.com/us/en/vertuo-coffee-pods',
  'https://www.nespresso.com/us/en/order/capsules/vertuo-line',
  'https://www.nespresso.com/us/en/order/capsules/vertuo',
]

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const MAX_NAMES = 200

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

async function fetchText(url, signal) {
  const res = await fetch(url, {
    signal,
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

// Pull { name, price, url } products out of any JSON-LD Product / ItemList blocks.
function productsFromJsonLd(html) {
  const out = []
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html))) {
    let data
    try { data = JSON.parse(m[1].trim()) } catch { continue }
    const nodes = Array.isArray(data) ? data : (data['@graph'] || [data])
    for (const node of nodes) collectProduct(node, out)
  }
  return out
}

function collectProduct(node, out) {
  if (!node || typeof node !== 'object') return
  const type = node['@type']
  const isProduct = type === 'Product' || (Array.isArray(type) && type.includes('Product'))
  if (isProduct && node.name) {
    const offers = Array.isArray(node.offers) ? node.offers[0] : node.offers
    const price = offers && (offers.price ?? offers.lowPrice)
    out.push({ name: node.name, price: price != null ? Number(price) : null, url: node.url || null })
  }
  if (Array.isArray(node.itemListElement)) {
    for (const el of node.itemListElement) collectProduct(el.item || el, out)
  }
}

function bestProductFor(name, products) {
  const target = normalize(name)
  if (!target) return null
  const targetWords = target.split(' ').filter(w => w.length > 2)
  let best = null
  let bestScore = 0
  for (const p of products) {
    const pn = normalize(p.name)
    let score = 0
    if (pn === target) score = 1
    else if (pn.includes(target) || target.includes(pn)) score = 0.9
    else if (targetWords.length) score = targetWords.filter(w => pn.includes(w)).length / targetWords.length
    if (score > bestScore) { bestScore = score; best = p }
  }
  return bestScore >= 0.6 ? best : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method-not-allowed' }); return }

  const { names } = req.body || {}
  if (!Array.isArray(names) || names.length === 0) {
    res.status(400).json({ error: 'missing-names' }); return
  }
  const wanted = names.slice(0, MAX_NAMES).map(String)
  const results = Object.fromEntries(wanted.map(n => [n, null]))

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  let products = []
  try {
    for (const url of LISTING_URLS) {
      try {
        const html = await fetchText(url, controller.signal)
        products = products.concat(productsFromJsonLd(html))
      } catch { /* try next url */ }
    }
  } finally {
    clearTimeout(timeout)
  }

  if (products.length === 0) {
    res.status(200).json({ results, degraded: true })
    return
  }

  for (const name of wanted) {
    const p = bestProductFor(name, products)
    if (p && p.price != null) {
      results[name] = {
        matchedName: p.name,
        priceSleeve: p.price,
        pricePerPod: null, // sleeve count not reliably exposed; show sleeve price
        currency: 'USD',
        url: p.url,
      }
    }
  }

  const matched = Object.values(results).filter(Boolean).length
  res.status(200).json({ results, degraded: matched === 0 })
}
