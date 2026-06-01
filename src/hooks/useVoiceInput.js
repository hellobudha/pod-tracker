import { useState, useRef, useCallback, useEffect } from 'react'

// Web Speech API wrapper. Optional layer over the text command input.
// iOS Safari / installed-PWA support is inconsistent, so everything is
// feature-detected and the caller must treat voice as optional.

const SpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)

export function useVoiceInput({ onResult } = {}) {
  const supported = Boolean(SpeechRecognition)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recRef = useRef(null)

  const stop = useCallback(() => {
    try { recRef.current?.stop() } catch { /* already stopped */ }
    setListening(false)
  }, [])

  const start = useCallback(() => {
    if (!supported) { setError('unsupported'); return }
    setError(null)
    setTranscript('')

    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript
      setTranscript(text)
      if (e.results[e.results.length - 1].isFinal) {
        onResult?.(text)
      }
    }
    rec.onerror = (e) => { setError(e.error || 'error'); setListening(false) }
    rec.onend = () => setListening(false)

    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setError('start-failed')
      setListening(false)
    }
  }, [supported, onResult])

  useEffect(() => () => { try { recRef.current?.abort() } catch { /* noop */ } }, [])

  return { supported, listening, transcript, error, start, stop }
}
