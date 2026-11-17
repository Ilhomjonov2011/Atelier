import { useMemo, useState } from 'react'
import { useAdminData } from '../../hooks/useAdminData'
import { AdminState } from './Dashboard'
import { money } from '../../utils'

export default function Customers() {
  const d = useAdminData()
  const [q, setQ] = useState('')
  const rows = useMemo(() => d.users.map((u) => {
    const name = `${u.name.firstname} ${u.name.lastname}`
    const mine = d.orders.filter((o) => o.customer.email === u.email)
    return { id: u.id, name, email: u.email, city: u.address.city, orders: mine.length, spent: mine.reduce((n, o) => n + o.total, 0) }
  }).filter((r) => (r.name + r.email).toLowerCase().includes(q.toLowerCase())), [d.users, d.orders, q])
  if (d.loading || d.error) return <AdminState d={d} />
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Customers</h1>
      <input className="input !w-64" placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search customers" />
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">City</th><th className="p-3">Orders</th><th className="p-3">Spent</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map((r) => <tr key={r.id}><td className="p-3 font-semibold capitalize">{r.name}</td><td className="p-3">{r.email}</td><td className="p-3 capitalize">{r.city}</td><td className="p-3">{r.orders}</td><td className="p-3">{money(r.spent)}</td></tr>)}
            {!rows.length && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No customers found.</td></tr>}</tbody></table>
      </div>
    </div>
  )
}
