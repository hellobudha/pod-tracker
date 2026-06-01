import { useState, useRef } from 'react'
import IntensityPicker from './IntensityPicker'
import Sheet from './Sheet'

const STATUSES = [
  { value: 'liked',      label: 'Liked',       color: 'bg-emerald-500' },
  { value: 'too_mild',   label: 'Too Mild',    color: 'bg-amber-400' },
  { value: 'too_strong', label: 'Too Strong',  color: 'bg-red-400' },
  { value: 'yet_to_try', label: 'Yet to Try',  color: 'bg-violet-400' },
]

const CATEGORIES = [
  { value: 'espresso',        label: 'Espresso' },
  { value: 'double_espresso', label: 'Double Espresso' },
  { value: 'gran_lungo',      label: 'Gran Lungo' },
  { value: 'coffee',          label: 'Coffee' },
]

const EMPTY = {
  name: '', category: 'coffee', decaf: false, flavored: false,
  status: 'yet_to_try', intensity: 0, aroma: 0,
  notes: '', reorder: false,
  priceSleeve: null, podsPerSleeve: null, pricePerPod: null,
  priceCurrency: 'USD', priceManual: false,
}

export default function PodSheet({ pod, draft, onSave, onDelete, onClose }) {
  // `pod` = existing pod (edit); `draft` = pre-filled fields for a new pod (from command flow)
  const [form, setForm] = useState(pod ? { ...pod } : { ...EMPTY, ...draft })
  const sheetRef = useRef(null)

  const isNew = !pod

  function close() {
    sheetRef.current?.close()
  }

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function setNum(key, raw) {
    const v = raw === '' ? null : Number(raw)
    set(key, Number.isFinite(v) ? v : null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const out = { ...form }
    // Derive price fields from the manual inputs
    const sleeve = form.priceSleeve
    const per = sleeve != null && form.podsPerSleeve > 0 ? sleeve / form.podsPerSleeve : null
    out.pricePerPod = per != null ? Math.round(per * 100) / 100 : null
    if (sleeve != null) {
      out.priceManual = true
      out.priceCurrency = 'USD'
      out.priceUpdatedAt = new Date().toISOString()
    }
    onSave(out)
    close()
  }

  function handleDelete() {
    if (confirm(`Delete "${pod.name}"?`)) {
      onDelete(pod.id)
      close()
    }
  }

  return (
    <Sheet ref={sheetRef} onClose={onClose} title={isNew ? 'Add Pod' : 'Edit Pod'}>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Pod Name</label>
          <input
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Colombia"
          />
        </div>

        {/* Category (cup size) */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => set('category', c.value)}
                className={`py-2 rounded-xl text-sm font-medium border-2 transition-all
                  ${form.category === c.value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Extra info tags */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Extra Info</label>
          <div className="flex gap-2">
            {[
              { key: 'decaf', label: 'Decaf' },
              { key: 'flavored', label: 'Flavored' },
            ].map(tag => (
              <button
                key={tag.key}
                type="button"
                onClick={() => {
                  set(tag.key, !form[tag.key])
                  if (navigator.vibrate) navigator.vibrate(10)
                }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all
                  ${form[tag.key]
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  set('status', s.value)
                  if (navigator.vibrate) navigator.vibrate(10)
                }}
                className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all
                  ${form.status === s.value
                    ? `${s.color} border-transparent text-white`
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ratings */}
        {form.status !== 'yet_to_try' && (
          <div className="mb-4 space-y-3">
            <IntensityPicker label="Strength (1–5)" value={form.intensity} onChange={v => set('intensity', v)} color="bg-amber-400" />
            <IntensityPicker label="Aroma (1–5)" value={form.aroma} onChange={v => set('aroma', v)} color="bg-purple-400" />
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Tasting Notes</label>
          <textarea
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="How did it taste black?"
          />
        </div>

        {/* Price (USD) — manual entry / override */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Price (USD)</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={form.priceSleeve ?? ''}
                  onChange={e => setNum('priceSleeve', e.target.value)}
                  placeholder="Sleeve price"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl pl-7 pr-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={form.podsPerSleeve ?? ''}
              onChange={e => setNum('podsPerSleeve', e.target.value)}
              placeholder="Pods/sleeve"
              className="w-28 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          {form.priceSleeve != null && form.podsPerSleeve > 0 && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              ≈ ${(form.priceSleeve / form.podsPerSleeve).toFixed(2)}/pod
            </p>
          )}
        </div>

        {/* Reorder toggle */}
        <button
          type="button"
          onClick={() => {
            set('reorder', !form.reorder)
            if (navigator.vibrate) navigator.vibrate(10)
          }}
          className="w-full mb-5 flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 min-h-[52px] py-3 text-left active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
        >
          <span className="text-base text-gray-700 dark:text-gray-200">Add to reorder list</span>
          <span
            className={`shrink-0 w-12 h-7 rounded-full transition-colors relative ${form.reorder ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.reorder ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </span>
        </button>

        {/* Actions */}
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white font-semibold py-3.5 rounded-2xl text-sm active:bg-emerald-600 transition-colors"
        >
          Save Pod
        </button>

        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full mt-2 text-red-500 font-medium py-3 text-sm"
          >
            Delete Pod
          </button>
        )}
      </form>
    </Sheet>
  )
}
