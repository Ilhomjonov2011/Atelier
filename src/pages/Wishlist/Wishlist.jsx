import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Empty, Stars } from '../../components/common/ui'
import { money } from '../../utils'

export default function Wishlist() {
  const { wishlist, toggleWish, addCart } = useStore()
  if (!wishlist.length) return <Empty icon={Heart} title="Nothing saved yet" text="Tap the heart on any product to keep it here." to="/shop" cta="Browse products" />
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold">Wishlist</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {wishlist.map((p) => (
          <div key={p.id} className="relative flex flex-col rounded-xl border border-slate-200 p-3">
            <button onClick={() => toggleWish(p)} className="absolute right-2 top-2 rounded-full p-1 hover:bg-slate-100" aria-label="Remove from wishlist"><X size={16} /></button>
            <Link to={`/product/${p.id}`} className="flex aspect-square items-center justify-center p-4"><img src={p.image} alt={p.title} className="max-h-full object-contain" /></Link>
            <Link to={`/product/${p.id}`} className="line-clamp-2 text-sm font-semibold hover:text-accent">{p.title}</Link>
            <Stars rate={p.rating?.rate} />
            <div className="mt-auto flex items-center justify-between pt-3"><b>{money(p.price)}</b><button className="btn-primary !px-3 !py-2" onClick={() => addCart(p)}><ShoppingBag size={15} /> Add</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
