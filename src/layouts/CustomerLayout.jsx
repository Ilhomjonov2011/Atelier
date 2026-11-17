import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const links = [['/', 'Home'], ['/shop', 'Shop'], ['/orders', 'Orders'], ['/profile', 'Profile']]
export default function CustomerLayout() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const cartCount = useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0))
  const wishCount = useStore((s) => s.wishlist.length)
  const submit = (e) => { e.preventDefault(); nav(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop'); setOpen(false) }
  const cls = ({ isActive }) => `text-sm font-semibold ${isActive ? 'text-accent' : 'text-slate-600 hover:text-slate-900'}`
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center gap-6">
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
          <Link to="/" className="text-xl font-extrabold tracking-tight">Atelier<span className="text-accent">.</span></Link>
          <nav className="hidden gap-6 md:flex">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}</nav>
          <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 md:block">
            <div className="relative"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="input !pl-9" aria-label="Search products" /></div>
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link to="/wishlist" className="relative rounded-lg p-2 hover:bg-slate-100" aria-label="Wishlist"><Heart size={20} />{wishCount > 0 && <b className="absolute -right-0.5 -top-0.5 rounded-full bg-accent px-1.5 text-[10px] text-white">{wishCount}</b>}</Link>
            <Link to="/cart" className="relative rounded-lg p-2 hover:bg-slate-100" aria-label="Cart"><ShoppingBag size={20} />{cartCount > 0 && <b className="absolute -right-0.5 -top-0.5 rounded-full bg-accent px-1.5 text-[10px] text-white">{cartCount}</b>}</Link>
            <Link to="/profile" className="hidden rounded-lg p-2 hover:bg-slate-100 sm:block" aria-label="Profile"><User size={20} /></Link>
          </div>
        </div>
        {open && (
          <div className="border-t border-slate-200 bg-white p-4 md:hidden">
            <form onSubmit={submit} className="mb-3"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="input" /></form>
            <div className="flex flex-col gap-3">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={cls}>{l}</NavLink>)}</div>
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="mt-16 border-t border-slate-200 bg-slate-50">
        <div className="container-x grid gap-8 py-10 sm:grid-cols-3">
          <div><p className="text-lg font-extrabold">Atelier<span className="text-accent">.</span></p><p className="mt-2 max-w-xs text-sm text-slate-500">A demo storefront. Orders are simulated and stored only in your browser.</p></div>
          <div className="text-sm"><p className="mb-2 font-bold">Shop</p><div className="flex flex-col gap-1 text-slate-500"><Link to="/shop">All products</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Cart</Link></div></div>
          <div className="text-sm"><p className="mb-2 font-bold">Account</p><div className="flex flex-col gap-1 text-slate-500"><Link to="/orders">Orders</Link><Link to="/profile">Profile</Link><Link to="/admin">Admin demo</Link></div></div>
        </div>
        <p className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">© {new Date().getFullYear()} Atelier demo store</p>
      </footer>
    </div>
  )
}
