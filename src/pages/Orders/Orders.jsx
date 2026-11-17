import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Empty, StatusBadge } from '../../components/common/ui'
import { fmtDate, money } from '../../utils'

export function OrderList({ limit }) {
  const orders = useStore((s) => s.orders)
  const statuses = useStore((s) => s.statuses)
  const list = limit ? orders.slice(0, limit) : orders
  if (!list.length) return <Empty icon={Package} title="No orders yet" text="Orders you place will appear here." to="/shop" cta="Start shopping" />
  return (
    <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
      {list.map((o) => (
        <li key={o.id}><Link to={`/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-slate-50">
          <div><p className="font-bold">{o.id}</p><p className="text-sm text-slate-500">{fmtDate(o.date)} · {o.items.reduce((n, i) => n + i.qty, 0)} items</p></div>
          <div className="flex items-center gap-4"><StatusBadge status={statuses[o.id] || o.status} /><b>{money(o.total)}</b></div>
        </Link></li>
      ))}
    </ul>
  )
}
export default function Orders() {
  const { id } = useParams()
  const placed = useLocation().state?.placed
  const orders = useStore((s) => s.orders)
  const statuses = useStore((s) => s.statuses)
  if (!id) return <div className="container-x py-8"><h1 className="mb-6 text-3xl font-extrabold">Orders</h1><OrderList /></div>
  const o = orders.find((x) => x.id === id)
  if (!o) return <Empty title="Order not found" text="This order is not stored in this browser." to="/orders" cta="All orders" />
  return (
    <div className="container-x max-w-3xl py-8">
      {placed && <div className="mb-6 flex items-center gap-3 rounded-xl bg-accent-soft p-4 text-accent"><CheckCircle2 /><p className="font-semibold">Thank you! Your demo order was placed.</p></div>}
      <Link to="/orders" className="text-sm text-accent">← All orders</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-extrabold">{o.id}</h1><StatusBadge status={statuses[o.id] || o.status} /></div>
      <p className="text-sm text-slate-500">Placed {fmtDate(o.date)}</p>
      <ul className="panel mt-6 divide-y divide-slate-100">
        {o.items.map((i) => <li key={i.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><img src={i.image} alt="" className="h-14 w-14 object-contain" /><span className="flex-1 text-sm font-semibold">{i.title}</span><span className="text-sm text-slate-500">{i.qty} × {money(i.price)}</span></li>)}
      </ul>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="panel text-sm"><p className="mb-1 font-bold">Delivery</p><p>{o.customer.name}</p><p className="text-slate-500">{o.customer.address}, {o.customer.city} {o.customer.zip}</p><p className="text-slate-500">{o.customer.email} · {o.customer.phone}</p></div>
        <div className="panel text-sm"><p className="mb-1 font-bold">Total</p><p className="text-2xl font-extrabold">{money(o.total)}</p></div>
      </div>
    </div>
  )
}
