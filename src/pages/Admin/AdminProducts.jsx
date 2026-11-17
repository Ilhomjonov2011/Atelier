import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useStore } from '../../store/useStore'
import { ErrorBox, Skeleton, Pagination } from '../../components/common/ui'
import { money } from '../../utils'

export default function AdminProducts() {
  const { products, categories, loading, error, retry } = useProducts()
  const del = useStore((s) => s.deleteProduct)
  const toast = useStore((s) => s.toast)
  const [q, setQ] = useState(''), [cat, setCat] = useState(''), [sort, setSort] = useState('new'), [page, setPage] = useState(1)
  const list = useMemo(() => {
    if (!products) return []
    const r = products.filter((p) => (!cat || p.category === cat) && p.title.toLowerCase().includes(q.toLowerCase()))
    const by = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, name: (a, b) => a.title.localeCompare(b.title) }[sort]
    return by ? [...r].sort(by) : r
  }, [products, q, cat, sort])
  const pages = Math.max(1, Math.ceil(list.length / 10))
  const shown = list.slice((page - 1) * 10, page * 10)
  const remove = (p) => { if (window.confirm(`Delete "${p.title}"?`)) { del(p.id); toast('Product deleted') } }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-extrabold">Products</h1><Link to="/admin/products/new" className="btn-primary"><Plus size={16} /> Add product</Link></div>
      <div className="flex flex-wrap gap-3">
        <input className="input !w-64" placeholder="Search products" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} aria-label="Search products" />
        <select className="input !w-48 capitalize" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1) }} aria-label="Filter category"><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="input !w-48" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="new">Default</option><option value="name">Name</option><option value="price-asc">Price ascending</option><option value="price-desc">Price descending</option></select>
      </div>
      {error ? <ErrorBox message={error} onRetry={retry} /> : loading ? <Skeleton className="h-64" /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((p) => <tr key={p.id}><td className="p-3"><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-10 w-10 object-contain" /><span className="line-clamp-1 max-w-xs font-semibold">{p.title}</span></div></td><td className="p-3 capitalize">{p.category}</td><td className="p-3">{money(p.price)}</td>
                <td className="p-3"><div className="flex justify-end gap-2"><Link to={`/admin/products/${p.id}/edit`} className="btn-ghost !p-2" aria-label="Edit"><Pencil size={15} /></Link><button onClick={() => remove(p)} className="btn-danger !p-2" aria-label="Delete"><Trash2 size={15} /></button></div></td></tr>)}
              {!shown.length && <tr><td colSpan="4" className="p-8 text-center text-slate-500">No products found.</td></tr>}
            </tbody></table>
        </div>
      )}
      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>
  )
}
