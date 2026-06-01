import { useState, useCallback } from 'react'
import { matchCatalogPrice } from '../lib/matchPrice'

/**
 * Match every pod against the local Nespresso catalog (US/USD) and write the
 * matched sleeve/per-pod price back via updatePod. Fully offline — no scraping.
 * A pod with a manual price (priceManual) is never overwritten.
 * state: idle | loading | done
 */
export function usePrices({ pods, updatePod }) {
  const [state, setState] = useState('idle')
  const [summary, setSummary] = useState(null) // { matched, total }

  const refreshPrices = useCallback(() => {
    if (pods.length === 0) return
    setState('loading')
    const now = new Date().toISOString()
    let matched = 0
    let considered = 0
    for (const pod of pods) {
      if (pod.priceManual) continue // respect manual override
      considered++
      const hit = matchCatalogPrice(pod.name)
      if (hit) {
        matched++
        updatePod(pod.id, {
          priceSleeve: hit.priceSleeve,
          podsPerSleeve: hit.podsPerSleeve,
          pricePerPod: hit.pricePerPod,
          priceCurrency: 'USD',
          priceUrl: null,
          priceUpdatedAt: now,
          priceManual: false,
        })
      }
    }
    setSummary({ matched, total: considered })
    setState('done')
  }, [pods, updatePod])

  return { state, summary, refreshPrices }
}
