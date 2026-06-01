import { useState, useRef, useEffect } from 'react'
import Sheet from './Sheet'
import { useCommand } from '../hooks/useCommand'
import { useVoiceInput } from '../hooks/useVoiceInput'

const EXAMPLES = [
  'Tried Colombia, loved it, strong enough, add to reorder',
  'Mark Ethiopia as too mild',
  'Add a new decaf called Half Caff',
]

export default function CommandBar({ pods, addPod, updatePod, onClose, onAddManually, onEditPod }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)
  const sheetRef = useRef(null)
  const { state, previews, staged, unmatched, source, runCommand, confirm, cancel } =
    useCommand({ pods, addPod, updatePod })

  const voice = useVoiceInput({ onResult: (t) => setText(t) })

  useEffect(() => {
    // autofocus the text field on open (skip if we just launched voice)
    const id = setTimeout(() => inputRef.current?.focus(), 350)
    return () => clearTimeout(id)
  }, [])

  function submit(e) {
    e?.preventDefault()
    if (voice.listening) voice.stop()
    runCommand(text)
  }

  function handleConfirm() {
    confirm()
    sheetRef.current?.close()
  }

  // "Edit" path for a single match → open the full sheet pre-filled
  const singleMatch = staged.length === 1 ? staged[0] : null
  function handleEdit() {
    if (!singleMatch) return
    if (singleMatch.isNew) {
      onEditPod?.({ draft: { name: singleMatch.podName, ...(singleMatch.changes || {}) } })
    } else {
      const pod = pods.find(p => p.id === singleMatch.podId)
      if (pod) onEditPod?.({ pod: { ...pod, ...(singleMatch.changes || {}) } })
    }
    sheetRef.current?.close()
  }

  return (
    <Sheet ref={sheetRef} onClose={onClose} title="Quick Command">
      {/* Input + mic */}
      {(state === 'idle' || state === 'parsing' || state === 'error') && (
        <form onSubmit={submit}>
          <div className="flex items-end gap-2 mb-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Tell me what changed…"
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
            {voice.supported && (
              <button
                type="button"
                onClick={() => (voice.listening ? voice.stop() : voice.start())}
                aria-label="Voice input"
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors
                  ${voice.listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                {voice.listening ? '■' : '🎤'}
              </button>
            )}
          </div>

          {voice.error && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
              Voice unavailable on this device — type your command instead.
            </p>
          )}

          {state === 'error' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
              I couldn’t map “{unmatched}” to a pod. Try naming the pod and what changed, or add it manually.
            </p>
          )}

          <button
            type="submit"
            disabled={state === 'parsing' || !text.trim()}
            className="w-full bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl text-sm active:bg-emerald-600 transition-colors"
          >
            {state === 'parsing' ? 'Thinking…' : 'Go'}
          </button>

          {/* Examples */}
          {state === 'idle' && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Try saying</p>
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setText(ex)}
                  className="block w-full text-left text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
                >
                  “{ex}”
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => { sheetRef.current?.close(); onAddManually?.() }}
            className="w-full mt-2 text-emerald-600 dark:text-emerald-400 font-medium py-2.5 text-sm"
          >
            + Add a pod manually
          </button>
        </form>
      )}

      {/* Confirmation */}
      {state === 'confirming' && (
        <div>
          <div className="space-y-2 mb-4">
            {previews.map((p, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100">
                {p}
              </div>
            ))}
            {unmatched && (
              <p className="text-xs text-gray-400 dark:text-gray-500">Ignored: “{unmatched}”</p>
            )}
            {source === 'local' && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Parsed offline — double-check before confirming.</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-2xl text-sm active:bg-emerald-600 transition-colors"
          >
            Confirm
          </button>
          <div className="flex gap-2 mt-2">
            {singleMatch && (
              <button
                type="button"
                onClick={handleEdit}
                className="flex-1 text-gray-700 dark:text-gray-200 font-medium py-2.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-2xl"
              >
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={cancel}
              className="flex-1 text-gray-500 dark:text-gray-400 font-medium py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
