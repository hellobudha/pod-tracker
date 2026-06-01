import { useState, useRef, useImperativeHandle, forwardRef } from 'react'

/**
 * Reusable iOS-style bottom sheet shell: backdrop, slide-up/down animation,
 * drag-to-dismiss, and safe-area padding. Children render inside a scrollable area.
 *
 * Expose an imperative `close()` (animates out, then calls onClose) via ref so
 * callers can dismiss after an action.
 */
const Sheet = forwardRef(function Sheet({ children, onClose, title }, ref) {
  const [closing, setClosing] = useState(false)
  const startY = useRef(null)

  function close() {
    setClosing(true)
    setTimeout(onClose, 280)
  }

  useImperativeHandle(ref, () => ({ close }))

  function handleTouchStart(e) {
    startY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e) {
    if (startY.current == null) return
    const dy = e.changedTouches[0].clientY - startY.current
    if (dy > 80) close()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={close} />

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[430px] bg-white dark:bg-gray-900 rounded-t-3xl z-50 shadow-2xl
          ${closing ? 'animate-slide-down' : 'animate-slide-up'}`}
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        <div className="px-5 pt-2 overflow-y-auto max-h-[85dvh]">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
          )}
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes slide-down {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
        .animate-slide-up  { animation: slide-up  0.28s cubic-bezier(0.32,0.72,0,1) both; }
        .animate-slide-down { animation: slide-down 0.28s cubic-bezier(0.32,0.72,0,1) both; }
      `}</style>
    </>
  )
})

export default Sheet
