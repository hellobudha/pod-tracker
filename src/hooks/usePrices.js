import { useState, useCallback } from 'react'

/**
 * On-demand Nespresso price refresh. POSTs all pod names to /api/prices and
 * writes matched prices back via updatePod. Fails soft (cards just omit price).
 * state: idle | loading | done | error
 */
export function usePrices({ pods, updatePod }) {
  const [state, setState] = useState('idle')
  const [summary, setSummary] = useState(null) // { matched, total, degraded }
  const [error, setError] = useState(null)

  const refreshPrices = useCallback(async () => {
    if (pods.length === 0) return
    setState('loading'); setError(null); setSummary(null)
    try {
      const names = pods.map(p => p.name)
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const results = data.results || {}
      const now = new Date().toISOString()
      let matched = 0
      for (const pod of pods) {
        if (pod.priceManual) continue // never overwrite a manual price
        const r = results[pod.name]
        if (r && (r.pricePerPod != null || r.priceSleeve != null)) {
          matched++
          updatePod(pod.id, {
            pricePerPod: r.pricePerPod ?? null,
            priceSleeve: r.priceSleeve ?? null,
            priceCurrency: r.currency || 'USD',
            priceUrl: r.url || null,
            priceUpdatedAt: now,
          })
        }
      }
      setSummary({ matched, total: pods.length, degraded: Boolean(data.degraded) })
      setState('done')
    } catch (e) {
      setError(e.message || 'failed')
      setState('error')
    }
  }, [pods, updatePod])

  return { state, summary, error, refreshPrices }
}
