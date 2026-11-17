import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useStore } from '../../store/useStore'
import ProductCard from '../../components/products/ProductCard'
import { Skeleton, ErrorBox, Stars, Empty } from '../../components/common/ui'
import { money } from '../../utils'

export default function ProductDetails() {
  const { id } = useParams()
  const { products, loading, error, retry } = useProducts()
  const [qty, setQty] = useState(1)
  const addCart = useStore((s) => s.addCart)
  const toggleWish = useStore((s) => s.toggleWish)
  const wished = useStore((s) => s.wishlist.some((w) => String(w.id) === id))
  if (error) return <div className="container-x py-12"><ErrorBox message={error} onRetry={retry} /></div>
  if (loading) return <div className="container-x grid gap-8 py-10 md:grid-cols-2"><Skeleton className="aspect-square" /><div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/4" /><Skeleton className="h-32" /></div></div>
  const p = products.find((x) => String(x.id) === id)
  if (!p) return <Empty title="Product not found" text="It may have been removed." to="/shop" cta="Back to shop" />
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)
  return (
    <div className="container-x py-8">
      <p className="mb-4 text-sm text-slate-500"><Link to="/shop" className="hover:text-accent">Shop</Link> / <span className="capitalize">{p.category}</span></p>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 p-10"><img src={p.image} alt={p.title} className="max-h-full object-contain" /></div>
        <div>
          <h1 className="text-2xl font-extrabold leading-snug sm:text-3xl">{p.title}</h1>
          <div className="mt-2"><Stars rate={p.rating?.rate} count={p.rating?.count} /></div>
          <p className="mt-4 text-3xl font-extrabold text-accent">{money(p.price)}</p>
          <p className="mt-4 max-w-prose leading-relaxed text-slate-600">{p.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-slate-300">
              <button className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button className="p-3" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
            <button className="btn-primary" onClick={() => addCart(p, qty)}><ShoppingBag size={16} /> Add to cart</button>
            <button className="btn-ghost" onClick={() => toggleWish(p)}><Heart size={16} className={wished ? 'fill-red-500 text-red-500' : ''} /> {wished ? 'Saved' : 'Save'}</button>
          </div>
        </div>
      </div>
      {related.length > 0 && <section className="mt-14"><h2 className="mb-4 text-xl font-extrabold">Related products</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>}
    </div>
  )
}
