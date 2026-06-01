import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-3-5-haiku-latest'
const MAX_TRANSCRIPT = 600
const MAX_PODS = 200

const STATUSES = ['liked', 'too_mild', 'too_strong', 'yet_to_try']
const CATEGORIES = ['espresso', 'double_espresso', 'gran_lungo', 'coffee']

const SYSTEM = `You convert a user's natural-language note about Nespresso coffee pods into structured edits.

You are given the user's current pod list (a "roster") and a transcript. Map the transcript to changes on existing pods, or to a brand-new pod.

Rules:
- Match pod names fuzzily against the roster (handle speech-to-text errors, partial names, plurals). Use the pod's exact "id" from the roster for existing pods.
- If the user clearly describes a pod not in the roster, return it with isNew=true, podId=null, and the spoken name.
- Map taste language to fields:
  - "loved it" / "great" / "good" / "nice" -> status "liked"
  - "too mild" / "weak" / "watery" -> status "too_mild"
  - "too strong" / "too bitter" / "harsh" -> status "too_strong"
  - "strong enough" / "perfect strength" -> do NOT change status; it implies a good intensity.
  - explicit "intensity 4" / "strength 3 out of 5" -> intensity (1-5)
  - "add to reorder" / "reorder it" -> reorder true; "remove from reorder" -> reorder false
  - "decaf" -> decaf true; "flavored" -> flavored true
  - free-text impressions can go into "notes"
- Only include fields that the user actually expressed. Leave everything else absent.
- status must be one of: liked, too_mild, too_strong, yet_to_try
- category must be one of: espresso, double_espresso, gran_lungo, coffee
- intensity and aroma are integers 1-5.
- Set confidence "low" if the pod match or the intent is uncertain.

Always respond by calling the apply_commands tool.`

const TOOL = {
  name: 'apply_commands',
  description: 'Return the structured pod edits derived from the transcript.',
  input_schema: {
    type: 'object',
    properties: {
      matches: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            podId: { type: ['string', 'null'] },
            podName: { type: 'string' },
            isNew: { type: 'boolean' },
            confidence: { type: 'string', enum: ['high', 'low'] },
            changes: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: STATUSES },
                intensity: { type: 'integer', minimum: 1, maximum: 5 },
                aroma: { type: 'integer', minimum: 1, maximum: 5 },
                category: { type: 'string', enum: CATEGORIES },
                decaf: { type: 'boolean' },
                flavored: { type: 'boolean' },
                reorder: { type: 'boolean' },
                notes: { type: 'string' },
              },
            },
          },
          required: ['podName', 'isNew', 'changes'],
        },
      },
      unmatched: { type: 'string' },
    },
    required: ['matches'],
  },
}

// Whitelist + coerce the model output against the known data model.
function sanitize(parsed, roster) {
  const ids = new Set(roster.map(p => p.id))
  const matches = []
  for (const m of parsed.matches || []) {
    if (!m || typeof m !== 'object') continue
    const isNew = Boolean(m.isNew)
    const podId = !isNew && ids.has(m.podId) ? m.podId : null
    if (!isNew && !podId) continue // can't update an unknown pod

    const src = m.changes || {}
    const changes = {}
    if (STATUSES.includes(src.status)) changes.status = src.status
    if (CATEGORIES.includes(src.category)) changes.category = src.category
    if (Number.isInteger(src.intensity) && src.intensity >= 1 && src.intensity <= 5) changes.intensity = src.intensity
    if (Number.isInteger(src.aroma) && src.aroma >= 1 && src.aroma <= 5) changes.aroma = src.aroma
    if (typeof src.decaf === 'boolean') changes.decaf = src.decaf
    if (typeof src.flavored === 'boolean') changes.flavored = src.flavored
    if (typeof src.reorder === 'boolean') changes.reorder = src.reorder
    if (typeof src.notes === 'string' && src.notes.trim()) changes.notes = src.notes.trim().slice(0, 500)

    if (Object.keys(changes).length === 0 && !isNew) continue
    matches.push({
      podId,
      podName: String(m.podName || '').slice(0, 80),
      isNew,
      confidence: m.confidence === 'low' ? 'low' : 'high',
      changes,
    })
  }
  return { matches, unmatched: typeof parsed.unmatched === 'string' ? parsed.unmatched.slice(0, 300) : '' }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method-not-allowed' })
    return
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: 'no-api-key' })
    return
  }

  const { transcript, pods } = req.body || {}
  if (typeof transcript !== 'string' || !transcript.trim()) {
    res.status(400).json({ error: 'missing-transcript' })
    return
  }
  if (!Array.isArray(pods) || pods.length === 0) {
    res.status(400).json({ error: 'missing-roster' })
    return
  }

  const text = transcript.slice(0, MAX_TRANSCRIPT)
  const roster = pods.slice(0, MAX_PODS).map(p => ({
    id: String(p.id), name: String(p.name || '').slice(0, 80), category: p.category, status: p.status,
  }))

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      tools: [TOOL],
      tool_choice: { type: 'tool', name: 'apply_commands' },
      messages: [
        {
          role: 'user',
          content: `Current pods (roster):\n${JSON.stringify(roster)}\n\nTranscript:\n"${text}"`,
        },
      ],
    })

    const toolUse = msg.content.find(c => c.type === 'tool_use')
    if (!toolUse) {
      res.status(200).json({ matches: [], unmatched: text })
      return
    }
    res.status(200).json(sanitize(toolUse.input, roster))
  } catch (e) {
    res.status(502).json({ error: 'parse-failed', detail: String(e?.message || e).slice(0, 200) })
  }
}
