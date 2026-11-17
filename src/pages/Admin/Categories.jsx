import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useStore } from '../../store/useStore'
import { ErrorBox, Skeleton } from '../../components/common/ui'
import { clean } from '../../utils'

export default function Categories() {
  const { products, categories, loading, error, retry } = useProducts()
  const { custom, addCat, delCat, toast } = useStore()
  const [name, setName] = useState('')
  if (error) return <ErrorBox message={error} onRetry={retry} />
  if (loading) return <Skeleton className="h-64" />
  const add = (e) => {
    e.preventDefault()
    const n = clean(name).toLowerCase()
    if (n.length < 2) return toast('Category name is too short', 'err')
    if (categories.includes(n)) return toast('That category already exists', 'err')
    addCat(n); setName(''); toast('Category added')
  }
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold">Categories</h1>
      <form onSubmit={add} className="flex gap-2"><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" maxLength={40} aria-label="New category" /><button className="btn-primary shrink-0">Add category</button></form>
      <ul className="panel divide-y divide-slate-100 !p-0">
        {categories.map((c) => {
          const n = products.filter((p) => p.category === c).length
          const removable = custom.cats.includes(c) && n === 0
          return <li key={c} className="flex items-center justify-between p-4"><span className="font-semibold capitalize">{c}</span><span className="flex items-center gap-4 text-sm text-slate-500">{n} products
            {removable && <button onClick={() => { delCat(c); toast('Category deleted') }} className="text-red-600" aria-label={`Delete ${c}`}><Trash2 size={16} /></button>}</span></li>
        })}
      </ul>
      <p className="text-xs text-slate-500">Categories that contain products cannot be deleted. Reassign those products first.</p>
    </div>
  )
}
