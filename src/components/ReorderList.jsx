import { useState } from 'react'

export default function ReorderList({ pods }) {
  const [copied, setCopied] = useState(false)
  const reorderPods = pods.filter(p => p.reorder)

  function copyList() {
    const text = reorderPods.map(p => `• ${p.name} (${p.category})`).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      if (navigator.vibrate) navigator.vibrate(10)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (reorderPods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">No pods marked for reorder yet.</p>
        <p className="text-xs mt-1">Toggle "Add to reorder list" when editing a pod.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">{reorderPods.length} pod{reorderPods.length !== 1 ? 's' : ''}</p>
        <button
          onClick={copyList}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
            ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700 active:bg-gray-300'}`}
        >
          {copied ? '✓ Copied!' : 'Copy list'}
        </button>
      </div>

      <div className="space-y-2">
        {reorderPods.map(pod => (
          <div key={pod.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{pod.name}</p>
              <p className="text-xs text-gray-400 capitalize">{pod.category}</p>
            </div>
            <span className="text-emerald-500 text-lg">↻</span>
          </div>
        ))}
      </div>
    </div>
  )
}
