import { Link } from 'react-router-dom'
import { Boxes, DollarSign, ShoppingCart, Users } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAdminData } from '../../hooks/useAdminData'
import { ErrorBox, Skeleton, StatusBadge } from '../../components/common/ui'
import { fmtDate, money } from '../../utils'

export const Stat = ({ icon: Icon, label, value }) => (
  <div className="panel flex items-center gap-4"><div className="rounded-lg bg-accent-soft p-3 text-accent"><Icon size={20} /></div><div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-extrabold">{value}</p></div></div>
)
export const AdminState = ({ d }) => d.error ? <ErrorBox message={d.error} onRetry={d.retry} /> : <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-64" /></div>

export default function Dashboard() {
  const d = useAdminData()
  if (d.loading || d.error) return <AdminState d={d} />
  const sold = {}
  d.orders.forEach((o) => o.items.forEach((i) => { sold[i.id] = (sold[i.id] || 0) + i.qty }))
  const top = Object.entries(sold).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, n]) => ({ p: d.products.find((x) => String(x.id) === id), n })).filter((x) => x.p)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Boxes} label="Products" value={d.products.length} /><Stat icon={ShoppingCart} label="Orders" value={d.orders.length} />
        <Stat icon={Users} label="Customers" value={d.users.length} /><Stat icon={DollarSign} label="Demo revenue" value={money(d.revenue)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="panel xl:col-span-2"><h2 className="mb-3 font-extrabold">Sales over time</h2>
          <div className="h-64"><ResponsiveContainer><LineChart data={d.byDay}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#0e7c66" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></div>
        <div className="panel"><h2 className="mb-3 font-extrabold">Best-selling products</h2>
          <ul className="space-y-3">{top.map(({ p, n }) => <li key={p.id} className="flex items-center gap-3 text-sm"><img src={p.image} alt="" className="h-10 w-10 object-contain" /><span className="line-clamp-1 flex-1">{p.title}</span><b>{n}</b></li>)}</ul></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="panel xl:col-span-2"><div className="mb-3 flex justify-between"><h2 className="font-extrabold">Recent orders</h2><Link to="/admin/orders" className="text-sm text-accent">View all</Link></div>
          <ul className="divide-y divide-slate-100 text-sm">{d.orders.slice(0, 6).map((o) => <li key={o.id} className="flex items-center justify-between gap-3 py-2"><span className="font-semibold">{o.id}</span><span className="hidden text-slate-500 sm:block">{o.customer.name}</span><StatusBadge status={o.status} /><b>{money(o.total)}</b></li>)}</ul></div>
        <div className="panel"><h2 className="mb-3 font-extrabold">Recent activity</h2>
          <ul className="space-y-2 text-sm text-slate-600">{d.orders.slice(0, 5).map((o) => <li key={o.id}>{o.customer.name} placed {o.id} on {fmtDate(o.date)}</li>)}</ul></div>
      </div>
    </div>
  )
}
