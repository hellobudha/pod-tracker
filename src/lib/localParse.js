// Lightweight offline fallback parser. Used when /api/parse-command is
// unreachable (offline or no API key). Handles simple commands:
//   "tried Colombia, loved it, strong, add to reorder"
// It is intentionally conservative — anything it can't confidently map is
// returned as `unmatched` so the UI can fall back to a pre-filled manual sheet.

const STATUS_KEYWORDS = [
  { status: 'liked', words: ['loved', 'love it', 'liked', 'like it', 'great', 'good', 'nice', 'enjoyed', 'tasty', 'delicious'] },
  { status: 'too_mild', words: ['too mild', 'too weak', 'weak', 'watery', 'mild', 'bland'] },
  { status: 'too_strong', words: ['too strong', 'too bitter', 'too intense', 'harsh', 'bitter'] },
  { status: 'yet_to_try', words: ['yet to try', 'not tried', 'haven\'t tried', 'to try'] },
]

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

// Score how well a pod name appears in the transcript (normalized word overlap).
function scorePod(transcriptN, podName) {
  const nameN = normalize(podName)
  if (!nameN) return 0
  if (transcriptN.includes(nameN)) return 1 // full name present
  const nameWords = nameN.split(' ').filter(w => w.length > 2)
  if (nameWords.length === 0) return 0
  const hits = nameWords.filter(w => transcriptN.includes(w)).length
  return hits / nameWords.length
}

export function localParse(transcript, pods) {
  const t = normalize(transcript)
  if (!t) return { matches: [], unmatched: transcript }

  // Best matching pod
  let best = null
  let bestScore = 0
  for (const pod of pods) {
    const score = scorePod(t, pod.name)
    if (score > bestScore) { bestScore = score; best = pod }
  }
  if (!best || bestScore < 0.5) {
    return { matches: [], unmatched: transcript }
  }

  const changes = {}

  // Status
  for (const { status, words } of STATUS_KEYWORDS) {
    if (words.some(w => t.includes(normalize(w)))) { changes.status = status; break }
  }

  // Intensity / strength number (1-5)
  const intMatch = t.match(/(?:intensity|strength)\D{0,6}([1-5])/) || t.match(/\b([1-5])\s*(?:out of|\/)\s*5/)
  if (intMatch) changes.intensity = Number(intMatch[1])

  // Reorder
  if (/(add|put).*(reorder|re order|order list)|reorder/.test(t)) changes.reorder = true
  if (/(remove|take).*(reorder|order list)/.test(t)) changes.reorder = false

  // Tags
  if (/\bdecaf\b/.test(t)) changes.decaf = true
  if (/\bflavou?red\b/.test(t)) changes.flavored = true

  if (Object.keys(changes).length === 0) {
    return { matches: [], unmatched: transcript }
  }

  return {
    matches: [{ podId: best.id, podName: best.name, isNew: false, confidence: bestScore >= 1 ? 'high' : 'low', changes }],
    unmatched: '',
  }
}
