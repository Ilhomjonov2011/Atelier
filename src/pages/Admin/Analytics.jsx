import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAdminData } from '../../hooks/useAdminData'
import { AdminState } from './Dashboard'
import { money } from '../../utils'

const COLORS = ['#0e7c66', '#2563eb', '#d97706', '#9333ea', '#dc2626']
const Chart = ({ title, children }) => <div className="panel"><h2 className="mb-3 font-extrabold">{title}</h2><div className="h-64"><ResponsiveContainer>{children}</ResponsiveContainer></div></div>
export default function Analytics() {
  const d = useAdminData()
  if (d.loading || d.error) return <AdminState d={d} />
  const cats = d.categories.map((c) => {
    const ps = d.products.filter((p) => p.category === c)
    return { name: c, products: ps.length, revenue: +d.orders.filter((o) => o.status !== 'Cancelled').flatMap((o) => o.items).filter((i) => ps.some((p) => p.id === i.id)).reduce((n, i) => n + i.price * i.qty, 0).toFixed(2) }
  })
  const avg = d.products.length ? d.products.reduce((n, p) => n + p.price, 0) / d.products.length : 0
  const top = [...d.products].sort((a, b) => b.rating.count - a.rating.count).slice(0, 6).map((p) => ({ name: p.title.slice(0, 16), reviews: p.rating.count }))
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Analytics</h1>
      <p className="text-sm text-slate-500">Average product price {money(avg)} · Revenue {money(d.revenue)} across {d.orders.length} orders (cancelled orders excluded).</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Chart title="Revenue by day"><LineChart data={d.byDay}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line dataKey="revenue" stroke="#0e7c66" strokeWidth={2} /></LineChart></Chart>
        <Chart title="Orders by day"><BarChart data={d.byDay}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} /></BarChart></Chart>
        <Chart title="Products per category"><PieChart><Pie data={cats} dataKey="products" nameKey="name" outerRadius={90} label>{cats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></Chart>
        <Chart title="Revenue by category"><BarChart data={cats}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="revenue" fill="#0e7c66" radius={[4, 4, 0, 0]} /></BarChart></Chart>
        <Chart title="Most reviewed products"><BarChart data={top} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="reviews" fill="#d97706" radius={[0, 4, 4, 0]} /></BarChart></Chart>
      </div>
    </div>
  )
}
