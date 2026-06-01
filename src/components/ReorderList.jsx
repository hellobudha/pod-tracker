import { useState } from 'react'

const CATEGORY_LABELS = {
  espresso: 'Espresso',
  double_espresso: 'Double Espresso',
  gran_lungo: 'Gran Lungo',
  coffee: 'Coffee',
}

const money = n => `$${n.toFixed(2)}`

export default function ReorderList({ pods }) {
  const [copied, setCopied] = useState(false)
  const reorderPods = pods.filter(p => p.reorder)

  // Estimate assumes 1 sleeve of each pod.
  const priced = reorderPods.filter(p => p.priceSleeve != null)
  const unpriced = reorderPods.length - priced.length
  const total = priced.reduce((sum, p) => sum + p.priceSleeve, 0)

  function copyList() {
    const lines = reorderPods.map(p => {
      const label = CATEGORY_LABELS[p.category] || p.category
      const price = p.priceSleeve != null ? ` — ${money(p.priceSleeve)}/sleeve` : ''
      return `• ${p.name} (${label})${price}`
    })
    lines.push('', `Estimated total (1 sleeve each): ${money(total)}`)
    if (unpriced > 0) lines.push(`(${unpriced} pod${unpriced !== 1 ? 's' : ''} without a price not included)`)
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      if (navigator.vibrate) navigator.vibrate(10)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (reorderPods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">No pods marked for reorder yet.</p>
        <p className="text-xs mt-1">Toggle "Add to reorder list" when editing a pod.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">{reorderPods.length} pod{reorderPods.length !== 1 ? 's' : ''}</p>
        <button
          onClick={copyList}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
            ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 active:bg-gray-300 dark:active:bg-gray-600'}`}
        >
          {copied ? '✓ Copied!' : 'Copy list'}
        </button>
      </div>

      <div className="space-y-2">
        {reorderPods.map(pod => (
          <div key={pod.id} className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{pod.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{CATEGORY_LABELS[pod.category] || pod.category}</p>
            </div>
            <div className="text-right shrink-0">
              {pod.priceSleeve != null ? (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{money(pod.priceSleeve)}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    sleeve{pod.pricePerPod != null ? ` · ${money(pod.pricePerPod)}/pod` : ''}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">No price</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estimated total */}
      <div className="mt-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Estimated total</p>
            <p className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70">1 sleeve of each · {priced.length} pod{priced.length !== 1 ? 's' : ''}</p>
          </div>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{money(total)}</p>
        </div>
        {unpriced > 0 && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2">
            {unpriced} pod{unpriced !== 1 ? 's' : ''} without a price — not included. Set a price or run “Match Nespresso prices”.
          </p>
        )}
      </div>
    </div>
  )
}
