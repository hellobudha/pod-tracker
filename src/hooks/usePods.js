import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SEED_PODS } from '../data/seed'

const STORAGE_KEY = 'pod-tracker-pods'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function save(pods) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pods))
}

export function usePods() {
  const [pods, setPods] = useState(() => load() ?? SEED_PODS)

  useEffect(() => {
    save(pods)
  }, [pods])

  function addPod(data) {
    const pod = {
      id: uuidv4(),
      addedOn: new Date().toISOString().slice(0, 10),
      triedOn: data.status !== 'yet_to_try' ? new Date().toISOString().slice(0, 10) : null,
      ...data,
    }
    setPods(prev => [...prev, pod])
    return pod
  }

  function updatePod(id, data) {
    setPods(prev => prev.map(p => {
      if (p.id !== id) return p
      const wasUntried = p.status === 'yet_to_try'
      const nowTried = data.status && data.status !== 'yet_to_try'
      return {
        ...p,
        ...data,
        triedOn: wasUntried && nowTried ? new Date().toISOString().slice(0, 10) : p.triedOn,
      }
    }))
  }

  function deletePod(id) {
    setPods(prev => prev.filter(p => p.id !== id))
  }

  return { pods, addPod, updatePod, deletePod }
}
