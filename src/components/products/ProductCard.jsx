import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Stars } from '../common/ui'
import { money } from '../../utils'

function ProductCard({ p }) {
  const addCart = useStore((s) => s.addCart)
  const toggleWish = useStore((s) => s.toggleWish)
  const wished = useStore((s) => s.wishlist.some((w) => w.id === p.id))
  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Link to={`/product/${p.id}`} className="flex h-full items-center justify-center p-6">
          <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.currentTarget.style.opacity = 0.2 }} />
        </Link>
        <button onClick={() => toggleWish(p)} aria-label="Toggle wishlist" className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
          <Heart size={16} className={wished ? 'fill-red-500 text-red-500' : 'text-slate-500'} />
        </button>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs capitalize text-slate-500">{p.category}</p>
        <Link to={`/product/${p.id}`} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-accent">{p.title}</Link>
        <Stars rate={p.rating?.rate} count={p.rating?.count} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-extrabold">{money(p.price)}</span>
          <button onClick={() => addCart(p)} className="btn-primary !px-3 !py-2" aria-label={`Add ${p.title} to cart`}><ShoppingBag size={15} /> Add</button>
        </div>
      </div>
    </div>
  )
}
export default memo(ProductCard)
