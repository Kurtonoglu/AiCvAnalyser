import { useState } from 'react'

const KEY = 'cvAnalyserHistory'
const MAX = 10

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export default function useAnalysisHistory() {
  const [history, setHistory] = useState(load)

  const saveEntry = (entry) => {
    const newEntry = { id: Date.now(), ...entry }
    const updated = [newEntry, ...history].slice(0, MAX)
    setHistory(updated)
    save(updated)
  }

  const deleteEntry = (id) => {
    const updated = history.filter((e) => e.id !== id)
    setHistory(updated)
    save(updated)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(KEY)
  }

  return [history, saveEntry, deleteEntry, clearHistory]
}
