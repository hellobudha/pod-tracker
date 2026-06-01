import { useState } from 'react'
import StatusBadge from './StatusBadge'

const STATUS_OPTIONS = [
  { value: 'liked',      label: '👍 Liked',   color: 'bg-emerald-500' },
  { value: 'too_mild',   label: 'Too Mild',   color: 'bg-amber-400' },
  { value: 'too_strong', label: 'Too Strong', color: 'bg-red-400' },
  { value: 'yet_to_try', label: 'Yet to Try', color: 'bg-violet-400' },
]

function Pips({ value, max = 5, color = 'bg-amber-400' }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i < value ? color : 'bg-gray-200 dark:bg-gray-700'}`} />
      ))}
    </div>
  )
}

function formatPrice(pod) {
  if (pod.pricePerPod != null) return `$${pod.pricePerPod.toFixed(2)}/pod`
  if (pod.priceSleeve != null) return `$${pod.priceSleeve.toFixed(2)}/sleeve`
  return null
}

export default function PodCard({ pod, onClick, onQuickUpdate }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const cardBorder = pod.decaf ? 'border-l-4 border-l-blue-400' : ''
  const price = formatPrice(pod)

  function pickStatus(e, value) {
    e.stopPropagation()
    onQuickUpdate?.(pod.id, { status: value })
    setPickerOpen(false)
    if (navigator.vibrate) navigator.vibrate(10)
  }

  function toggleReorder(e) {
    e.stopPropagation()
    onQuickUpdate?.(pod.id, { reorder: !pod.reorder })
    if (navigator.vibrate) navigator.vibrate(10)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter') onClick?.() }}
      className={`w-full text-left bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm active:scale-[0.98] transition-transform cursor-pointer ${cardBorder}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-snug flex-1">{pod.name}</p>
        {/* Tappable status badge → inline quick picker */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); setPickerOpen(o => !o) }}
          className="shrink-0"
          aria-label="Change status"
        >
          <StatusBadge status={pod.status} />
        </button>
      </div>

      {pickerOpen && (
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={e => pickStatus(e, s.value)}
              className={`py-1.5 rounded-lg text-xs font-medium border-2 transition-all
                ${pod.status === s.value
                  ? `${s.color} border-transparent text-white`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {(pod.decaf || pod.flavored) && (
        <div className="flex gap-1.5 mt-1.5">
          {pod.decaf && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              Decaf
            </span>
          )}
          {pod.flavored && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300">
              Flavored
            </span>
          )}
        </div>
      )}

      {pod.status !== 'yet_to_try' && (
        <div className="flex gap-4 mt-2">
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Strength</p>
            <Pips value={pod.intensity} color="bg-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Aroma</p>
            <Pips value={pod.aroma} color="bg-purple-400" />
          </div>
        </div>
      )}

      {/* Footer row: price + tappable reorder toggle */}
      <div className="flex items-center justify-between gap-2 mt-2">
        {price ? (
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{price}</span>
        ) : <span />}
        <button
          type="button"
          onClick={toggleReorder}
          className={`text-[11px] font-semibold px-2 py-1 rounded-full transition-colors
            ${pod.reorder
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
              : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}
          aria-label={pod.reorder ? 'Remove from reorder list' : 'Add to reorder list'}
        >
          {pod.reorder ? '↻ Reorder' : '+ Reorder'}
        </button>
      </div>

      {pod.notes ? (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 line-clamp-1">{pod.notes}</p>
      ) : null}
    </div>
  )
}
