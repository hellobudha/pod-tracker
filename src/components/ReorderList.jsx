import { useState } from 'react'

const CATEGORY_LABELS = {
  espresso: 'Espresso',
  double_espresso: 'Double Espresso',
  gran_lungo: 'Gran Lungo',
  coffee: 'Coffee',
}

const money = n => `$${n.toFixed(2)}`
const qtyOf = p => Math.max(1, p.reorderQty || 1)

export default function ReorderList({ pods, onUpdate }) {
  const [copied, setCopied] = useState(false)
  const reorderPods = pods.filter(p => p.reorder)

  const priced = reorderPods.filter(p => p.priceSleeve != null)
  const unpriced = reorderPods.length - priced.length
  const totalSleeves = reorderPods.reduce((sum, p) => sum + qtyOf(p), 0)
  const total = priced.reduce((sum, p) => sum + p.priceSleeve * qtyOf(p), 0)

  function setQty(pod, next) {
    onUpdate?.(pod.id, { reorderQty: Math.max(1, next) })
    if (navigator.vibrate) navigator.vibrate(10)
  }

  function copyList() {
    const lines = reorderPods.map(p => {
      const label = CATEGORY_LABELS[p.category] || p.category
      const qty = qtyOf(p)
      const price = p.priceSleeve != null
        ? ` — ${qty} × ${money(p.priceSleeve)} = ${money(p.priceSleeve * qty)}`
        : ` — ${qty} sleeve${qty !== 1 ? 's' : ''}`
      return `• ${p.name} (${label})${price}`
    })
    lines.push('', `Estimated total (${totalSleeves} sleeve${totalSleeves !== 1 ? 's' : ''}): ${money(total)}`)
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
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {reorderPods.length} pod{reorderPods.length !== 1 ? 's' : ''} · {totalSleeves} sleeve{totalSleeves !== 1 ? 's' : ''}
        </p>
        <button
          onClick={copyList}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
            ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 active:bg-gray-300 dark:active:bg-gray-600'}`}
        >
          {copied ? '✓ Copied!' : 'Copy list'}
        </button>
      </div>

      <div className="space-y-2">
        {reorderPods.map(pod => {
          const qty = qtyOf(pod)
          return (
            <div key={pod.id} className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{pod.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {CATEGORY_LABELS[pod.category] || pod.category}
                    {pod.priceSleeve != null ? ` · ${money(pod.priceSleeve)}/sleeve` : ' · no price'}
                  </p>
                </div>
                {pod.priceSleeve != null && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">
                    {money(pod.priceSleeve * qty)}
                  </p>
                )}
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] text-gray-400 dark:text-gray-500">Sleeves</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty(pod, qty - 1)}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-lg leading-none flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(pod, qty + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-lg leading-none flex items-center justify-center active:scale-95 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Estimated total */}
      <div className="mt-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Estimated total</p>
            <p className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70">
              {totalSleeves} sleeve{totalSleeves !== 1 ? 's' : ''}
            </p>
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
