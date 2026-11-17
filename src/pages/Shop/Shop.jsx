import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/products/ProductCard'
import { CardSkeletons, ErrorBox, Empty, Pagination } from '../../components/common/ui'
import { PAGE_SIZE } from '../../constants'

const SORTS = { featured: 'Featured', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', rating: 'Top rated', popular: 'Most reviewed' }
export default function Shop() {
  const { products, categories, loading, error, retry } = useProducts()
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') || '', cat = sp.get('cat') || ''
  const [min, setMin] = useState(''), [max, setMax] = useState(''), [rating, setRating] = useState(0), [sort, setSort] = useState('featured'), [page, setPage] = useState(1)
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }
  useEffect(() => setPage(1), [q, cat, min, max, rating, sort])
  const list = useMemo(() => {
    if (!products) return []
    const s = q.toLowerCase()
    const r = products.filter((p) => (!cat || p.category === cat) && (!s || p.title.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)) &&
      (min === '' || p.price >= +min) && (max === '' || p.price <= +max) && p.rating.rate >= rating)
    const by = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating.rate - a.rating.rate, popular: (a, b) => b.rating.count - a.rating.count }[sort]
    return by ? [...r].sort(by) : r
  }, [products, q, cat, min, max, rating, sort])
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const reset = () => { setSp({}); setMin(''); setMax(''); setRating(0); setSort('featured') }
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold">Shop</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-5">
          <div><label className="label" htmlFor="q">Search</label><input id="q" className="input" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search products" /></div>
          <div><label className="label" htmlFor="cat">Category</label>
            <select id="cat" className="input capitalize" value={cat} onChange={(e) => set('cat', e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><p className="label">Price range</p><div className="flex gap-2"><input type="number" min="0" className="input" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} aria-label="Minimum price" /><input type="number" min="0" className="input" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} aria-label="Maximum price" /></div></div>
          <div><label className="label" htmlFor="rt">Minimum rating</label><select id="rt" className="input" value={rating} onChange={(e) => setRating(+e.target.value)}>{[0, 3, 3.5, 4, 4.5].map((r) => <option key={r} value={r}>{r ? `${r}+ stars` : 'Any rating'}</option>)}</select></div>
          <button className="btn-ghost w-full" onClick={reset}>Clear filters</button>
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">{products ? `${list.length} products` : 'Loading…'}</p>
            <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          </div>
          {error ? <ErrorBox message={error} onRetry={retry} /> : loading ? <CardSkeletons /> : shown.length === 0 ? (
            <Empty icon={SearchX} title="No products match" text="Try removing a filter or searching for something else." />
          ) : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{shown.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
          <Pagination page={page} pages={pages} onChange={(n) => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        </section>
      </div>
    </div>
  )
}
