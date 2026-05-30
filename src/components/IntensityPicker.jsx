export default function IntensityPicker({ value, onChange, label, color = 'bg-amber-400' }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === value ? 0 : n)}
            className={`w-10 h-10 rounded-full text-sm font-semibold border-2 transition-all
              ${n <= value
                ? `${color} border-transparent text-white`
                : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
