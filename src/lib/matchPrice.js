import { NESPRESSO_CATALOG } from '../data/nespressoCatalog'

// Normalize a pod name for fuzzy matching: lowercase, strip accents/punctuation,
// expand "decaf" -> "decaffeinato", "&" -> "and".
function normalize(s) {
  return (s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents (Caffè -> Caffe)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\bdecaf\b/g, 'decaffeinato')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOP = new Set(['and', 'the', 'over', 'ice', 'flavor', 'style', 'blend'])

function tokens(s) {
  return normalize(s).split(' ').filter(w => w && !STOP.has(w))
}

// F1 of token overlap between query and candidate (precision favours complete
// candidate coverage, recall favours covering the query).
function score(queryTokens, candTokens) {
  if (queryTokens.length === 0 || candTokens.length === 0) return 0
  const q = new Set(queryTokens)
  const c = new Set(candTokens)
  let inter = 0
  for (const t of c) if (q.has(t)) inter++
  const precision = inter / c.size
  const recall = inter / q.size
  if (precision + recall === 0) return 0
  return (2 * precision * recall) / (precision + recall)
}

const PRECOMPUTED = NESPRESSO_CATALOG.map(item => ({ item, toks: tokens(item.name) }))

/**
 * Find the best catalog match for a pod name.
 * Returns { name, description, priceSleeve, podsPerSleeve, pricePerPod } or null.
 */
export function matchCatalogPrice(podName, threshold = 0.5) {
  const qToks = tokens(podName)
  if (qToks.length === 0) return null

  let best = null
  let bestScore = 0
  for (const { item, toks } of PRECOMPUTED) {
    const s = score(qToks, toks)
    if (s > bestScore) { bestScore = s; best = item }
  }
  if (!best || bestScore < threshold) return null

  const pricePerPod = best.podsPerSleeve > 0
    ? Math.round((best.priceSleeve / best.podsPerSleeve) * 100) / 100
    : null

  return {
    name: best.name,
    description: best.description,
    priceSleeve: best.priceSleeve,
    podsPerSleeve: best.podsPerSleeve,
    pricePerPod,
  }
}
