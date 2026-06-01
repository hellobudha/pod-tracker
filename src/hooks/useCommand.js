import { useState, useCallback } from 'react'
import { localParse } from '../lib/localParse'

const STATUS_LABELS = {
  liked: 'Liked',
  too_mild: 'Too Mild',
  too_strong: 'Too Strong',
  yet_to_try: 'Yet to Try',
}
const CATEGORY_LABELS = {
  espresso: 'Espresso',
  double_espresso: 'Double Espresso',
  gran_lungo: 'Gran Lungo',
  coffee: 'Coffee',
}

// Build a plain-English description of one match's changes.
function describe(match) {
  const c = match.changes || {}
  const parts = []
  if (c.status) parts.push(`status ${STATUS_LABELS[c.status] || c.status}`)
  if (c.intensity != null) parts.push(`strength ${c.intensity}`)
  if (c.aroma != null) parts.push(`aroma ${c.aroma}`)
  if (c.category) parts.push(CATEGORY_LABELS[c.category] || c.category)
  if (c.decaf === true) parts.push('decaf')
  if (c.flavored === true) parts.push('flavored')
  if (c.reorder === true) parts.push('add to reorder list')
  if (c.reorder === false) parts.push('remove from reorder list')
  if (c.notes) parts.push(`notes “${c.notes}”`)
  const verb = match.isNew ? 'Add' : 'Update'
  const target = match.isNew ? `new pod “${match.podName}”` : `“${match.podName}”`
  return `${verb} ${target}: ${parts.length ? parts.join(', ') : 'no changes'}`
}

function slimRoster(pods) {
  return pods.map(p => ({
    id: p.id, name: p.name, category: p.category, status: p.status,
    intensity: p.intensity, aroma: p.aroma, reorder: p.reorder,
    decaf: p.decaf, flavored: p.flavored,
  }))
}

/**
 * Orchestrates natural-language commands.
 * state: idle | parsing | confirming | error
 */
export function useCommand({ pods, addPod, updatePod }) {
  const [state, setState] = useState('idle')
  const [staged, setStaged] = useState([])     // array of matches
  const [previews, setPreviews] = useState([]) // human-readable strings
  const [unmatched, setUnmatched] = useState('')
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null)   // 'api' | 'local'

  const reset = useCallback(() => {
    setState('idle'); setStaged([]); setPreviews([]); setUnmatched(''); setError(null); setSource(null)
  }, [])

  const runCommand = useCallback(async (transcript) => {
    const text = (transcript || '').trim()
    if (!text) return
    setState('parsing'); setError(null)

    let result = null
    try {
      const res = await fetch('/api/parse-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, pods: slimRoster(pods) }),
      })
      if (res.ok) {
        result = await res.json()
        setSource('api')
      }
    } catch {
      // network/offline — fall through to local parser
    }

    if (!result) {
      result = localParse(text, pods)
      setSource('local')
    }

    const matches = (result.matches || []).filter(m => m && (m.isNew || m.podId))
    if (matches.length === 0) {
      setUnmatched(result.unmatched || text)
      setState('error')
      setError('couldn’t-map')
      return
    }

    setStaged(matches)
    setPreviews(matches.map(describe))
    setUnmatched(result.unmatched || '')
    setState('confirming')
  }, [pods])

  const confirm = useCallback(() => {
    for (const m of staged) {
      if (m.isNew) {
        addPod({ name: m.podName, ...(m.changes || {}) })
      } else {
        updatePod(m.podId, m.changes || {})
      }
    }
    if (navigator.vibrate) navigator.vibrate(15)
    reset()
  }, [staged, addPod, updatePod, reset])

  return { state, previews, staged, unmatched, error, source, runCommand, confirm, cancel: reset }
}
