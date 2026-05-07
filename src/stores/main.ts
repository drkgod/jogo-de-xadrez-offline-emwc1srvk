export function createStore<T>(key: string, initialState: T) {
  const getSnapshot = () => {
    try {
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : initialState
    } catch {
      return initialState
    }
  }

  const subscribe = (listener: () => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) listener()
    }
    const customEvent = () => listener()
    window.addEventListener('storage', handleStorage)
    window.addEventListener(`local-storage-${key}`, customEvent)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(`local-storage-${key}`, customEvent)
    }
  }

  const setState = (newState: T | ((prev: T) => T)) => {
    const prev = getSnapshot()
    const next = typeof newState === 'function' ? (newState as any)(prev) : newState
    localStorage.setItem(key, JSON.stringify(next))
    window.dispatchEvent(new Event(`local-storage-${key}`))
  }

  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialState))
  }

  return { getSnapshot, subscribe, setState }
}
