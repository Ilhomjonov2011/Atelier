import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { useStore } from '../store/useStore'

export function useProducts() {
  const [raw, setRaw] = useState(null)
  const [error, setError] = useState(null)
  const [tries, setTries] = useState(0)
  const custom = useStore((s) => s.custom)
  useEffect(() => {
    let live = true
    setError(null)
    api.products().then((d) => live && setRaw(d)).catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [tries])
  const products = useMemo(() => raw && [
    ...custom.added,
    ...raw.filter((p) => !custom.deleted.includes(p.id)).map((p) => ({ ...p, ...(custom.edited[p.id] || {}) })),
  ], [raw, custom])
  const categories = useMemo(() => (products ? [...new Set([...products.map((p) => p.category), ...custom.cats])].sort() : []), [products, custom.cats])
  return { products, categories, loading: !products && !error, error, retry: () => { api.clear(); setTries((n) => n + 1) } }
}
