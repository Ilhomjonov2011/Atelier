import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { BarChart3, Boxes, LayoutDashboard, LogOut, Menu, Settings, ShoppingCart, Tags, Users, X, PlusSquare } from 'lucide-react'
import { useStore } from '../store/useStore'

const items = [
  ['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/products', 'Products', Boxes], ['/admin/products/new', 'Add product', PlusSquare],
  ['/admin/categories', 'Categories', Tags], ['/admin/orders', 'Orders', ShoppingCart], ['/admin/customers', 'Customers', Users],
  ['/admin/analytics', 'Analytics', BarChart3], ['/admin/settings', 'Settings', Settings],
]
export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const logout = useStore((s) => s.logoutAdmin)
  const nav = useNavigate()
  const link = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-accent text-white' : 'text-slate-300 hover:bg-slate-800'}`
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className={`${open ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 p-4 lg:static lg:block`}>
        <div className="mb-6 flex items-center justify-between"><span className="text-lg font-extrabold text-white">Atelier admin</span><button className="text-white lg:hidden" onClick={() => setOpen(false)}><X /></button></div>
        <nav className="space-y-1">{items.map(([to, l, Icon, end]) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={link}><Icon size={18} />{l}</NavLink>)}</nav>
        <div className="mt-6 space-y-1 border-t border-slate-700 pt-4">
          <Link to="/" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">View storefront</Link>
          <button onClick={() => { logout(); nav('/admin/login') }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"><LogOut size={18} />Sign out</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <p className="text-xs font-semibold text-amber-700">Demo admin: client-side only, not secure for production.</p>
        </div>
        <main className="p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
