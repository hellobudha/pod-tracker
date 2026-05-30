import StatusBadge from './StatusBadge'

function Pips({ value, max = 5, color = 'bg-amber-400' }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i < value ? color : 'bg-gray-200'}`} />
      ))}
    </div>
  )
}

export default function PodCard({ pod, onClick }) {
  const isDecaf = pod.decaf
  const cardBorder = isDecaf ? 'border-l-4 border-l-blue-400' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl px-4 py-3 shadow-sm active:scale-[0.98] transition-transform ${cardBorder}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-900 text-sm leading-snug flex-1">{pod.name}</p>
        <StatusBadge status={pod.status} />
      </div>

      {pod.status !== 'yet_to_try' && (
        <div className="flex gap-4 mt-2">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Strength</p>
            <Pips value={pod.intensity} color="bg-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Aroma</p>
            <Pips value={pod.aroma} color="bg-purple-400" />
          </div>
          {pod.reorder && (
            <div className="ml-auto flex items-end">
              <span className="text-[10px] text-emerald-600 font-semibold">↻ Reorder</span>
            </div>
          )}
        </div>
      )}

      {pod.notes ? (
        <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{pod.notes}</p>
      ) : null}
    </button>
  )
}
