import { useMemo, useState } from 'react'
import { useAdminData } from '../../hooks/useAdminData'
import { useStore } from '../../store/useStore'
import { StatusBadge, Pagination } from '../../components/common/ui'
import { AdminState } from './Dashboard'
import { STATUSES } from '../../constants'
import { fmtDate, money } from '../../utils'

export default function AdminOrders() {
  const d = useAdminData()
  const setStatus = useStore((s) => s.setStatus)
  const [q, setQ] = useState(''), [st, setSt] = useState(''), [open, setOpen] = useState(null), [page, setPage] = useState(1)
  const list = useMemo(() => d.orders.filter((o) => (!st || o.status === st) && (o.id + o.customer.name + o.customer.email).toLowerCase().includes(q.toLowerCase())), [d.orders, q, st])
  if (d.loading || d.error) return <AdminState d={d} />
  const pages = Math.max(1, Math.ceil(list.length / 10))
  const sel = d.orders.find((o) => o.id === open)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Orders</h1>
      <div className="flex flex-wrap gap-3">
        <input className="input !w-64" placeholder="Search by ID, name or email" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} aria-label="Search orders" />
        <select className="input !w-48" value={st} onChange={(e) => { setSt(e.target.value); setPage(1) }} aria-label="Filter status"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Total</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {list.slice((page - 1) * 10, page * 10).map((o) => <tr key={o.id} onClick={() => setOpen(o.id)} className="cursor-pointer hover:bg-slate-50"><td className="p-3 font-semibold">{o.id}</td><td className="p-3">{o.customer.name}</td><td className="p-3">{fmtDate(o.date)}</td><td className="p-3"><StatusBadge status={o.status} /></td><td className="p-3 font-bold">{money(o.total)}</td></tr>)}
            {!list.length && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No orders found.</td></tr>}
          </tbody></table>
      </div>
      <Pagination page={page} pages={pages} onChange={setPage} />
      {sel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">{sel.id}</h2><button onClick={() => setOpen(null)} className="btn-ghost !py-1.5">Close</button></div>
            <p className="mt-1 text-sm text-slate-500">{sel.customer.name} · {sel.customer.email}</p>
            <p className="text-sm text-slate-500">{sel.customer.address}{sel.customer.city ? `, ${sel.customer.city}` : ''}</p>
            <ul className="my-4 space-y-2 text-sm">{sel.items.map((i) => <li key={i.id} className="flex justify-between gap-3"><span className="line-clamp-1">{i.qty} × {i.title}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
            <p className="mb-3 text-right font-extrabold">Total {money(sel.total)}</p>
            <label className="label" htmlFor="stt">Order status</label>
            <select id="stt" className="input" value={sel.status} onChange={(e) => setStatus(sel.id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
        </div>
      )}
    </div>
  )
}
