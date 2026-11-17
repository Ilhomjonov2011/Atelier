import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Empty } from '../../components/common/ui'
import { money, totals } from '../../utils'

export function Summary({ items }) {
  const t = totals(items)
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{money(t.subtotal)}</span></div>
      <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{t.shipping ? money(t.shipping) : 'Free'}</span></div>
      <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold"><span>Total</span><span>{money(t.total)}</span></div>
    </div>
  )
}
export default function Cart() {
  const { cart, setQty, removeCart } = useStore()
  if (!cart.length) return <Empty icon={ShoppingBag} title="Your cart is empty" text="Add a few products and they will show up here." to="/shop" cta="Start shopping" />
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold">Shopping cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {cart.map((i) => (
            <li key={i.id} className="flex gap-4 p-4">
              <Link to={`/product/${i.id}`} className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-slate-200 p-2"><img src={i.image} alt="" className="max-h-full object-contain" /></Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/product/${i.id}`} className="line-clamp-2 text-sm font-semibold hover:text-accent">{i.title}</Link>
                <p className="mt-1 text-sm text-slate-500">{money(i.price)} each</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="inline-flex items-center rounded-lg border border-slate-300">
                    <button className="p-2" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <button className="p-2" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                  </div>
                  <span className="font-bold">{money(i.price * i.qty)}</span>
                  <button onClick={() => removeCart(i.id)} className="p-2 text-slate-400 hover:text-red-600" aria-label="Remove"><Trash2 size={16} /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="panel h-fit"><h2 className="mb-4 font-extrabold">Order summary</h2><Summary items={cart} /><Link to="/checkout" className="btn-primary mt-5 w-full">Go to checkout</Link></aside>
      </div>
    </div>
  )
}
