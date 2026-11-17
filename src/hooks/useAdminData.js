import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { useStore } from '../store/useStore'
import { useProducts } from './useProducts'

const SEED_STATUS = ['Delivered', 'Shipped', 'Processing', 'Delivered']
export function useAdminData() {
  const { products, categories, loading: pl, error: pe, retry } = useProducts()
  const [carts, setCarts] = useState(null), [users, setUsers] = useState(null), [error, setError] = useState(null)
  const orders = useStore((s) => s.orders)
  const statuses = useStore((s) => s.statuses)
  useEffect(() => {
    let live = true
    Promise.all([api.carts(), api.users()]).then(([c, u]) => { if (live) { setCarts(c); setUsers(u) } }).catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [])
  const all = useMemo(() => {
    if (!products || !carts || !users) return []
    const seed = carts.map((c) => {
      const u = users.find((x) => x.id === c.userId)
      const items = c.products.map((p) => { const pr = products.find((x) => x.id === p.productId); return pr && { id: pr.id, title: pr.title, price: pr.price, image: pr.image, qty: p.quantity } }).filter(Boolean)
      return { id: 'DEMO-' + c.id, date: c.date, status: SEED_STATUS[c.id % 4], customer: { name: u ? `${u.name.firstname} ${u.name.lastname}` : 'Guest', email: u?.email || '', phone: u?.phone || '', address: u ? u.address.street : '', city: u ? u.address.city : '', zip: u ? u.address.zipcode : '' }, items, total: items.reduce((n, i) => n + i.price * i.qty, 0) }
    })
    return [...orders, ...seed].map((o) => ({ ...o, status: statuses[o.id] || o.status })).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [products, carts, users, orders, statuses])
  const revenue = useMemo(() => all.filter((o) => o.status !== 'Cancelled').reduce((n, o) => n + o.total, 0), [all])
  const byDay = useMemo(() => {
    const m = {}
    all.filter((o) => o.status !== 'Cancelled').forEach((o) => { const d = o.date.slice(0, 10); m[d] = m[d] || { day: d, revenue: 0, orders: 0 }; m[d].revenue += o.total; m[d].orders++ })
    return Object.values(m).sort((a, b) => a.day.localeCompare(b.day)).map((d) => ({ ...d, revenue: +d.revenue.toFixed(2) }))
  }, [all])
  const loading = pl || (!error && !pe && (!carts || !users))
  return { products, categories, users: users || [], orders: all, revenue, byDay, loading, error: pe || error, retry }
}
