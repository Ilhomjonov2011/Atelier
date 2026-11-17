import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/products/ProductCard'
import { CardSkeletons, ErrorBox } from '../../components/common/ui'
import { useStore } from '../../store/useStore'
import { isEmail } from '../../utils'

export default function Home() {
  const { products, categories, loading, error, retry } = useProducts()
  const toast = useStore((s) => s.toast)
  const [email, setEmail] = useState('')
  const featured = products ? [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4) : []
  const best = products ? [...products].sort((a, b) => b.rating.count - a.rating.count).slice(0, 4) : []
  const hero = products?.[0]
  const subscribe = (e) => {
    e.preventDefault()
    if (!isEmail(email)) return toast('Enter a valid email address', 'err')
    toast('Subscribed (demo)'); setEmail('')
  }
  return (
    <div>
      <section className="border-b border-slate-200 bg-accent-soft">
        <div className="container-x grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Everyday goods, chosen with care.</h1>
            <p className="mt-4 max-w-md text-slate-600">Clothing, jewelry and electronics from one catalog. Free shipping on orders over $100.</p>
            <div className="mt-6 flex gap-3"><Link to="/shop" className="btn-primary">Shop all products <ArrowRight size={16} /></Link><Link to="/wishlist" className="btn-ghost">View wishlist</Link></div>
          </div>
          <div className="mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {hero ? <img src={hero.image} alt={hero.title} className="max-h-full object-contain" /> : <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-3 py-6 sm:grid-cols-3">
        {[[Truck, 'Free shipping over $100'], [RotateCcw, '30-day returns'], [ShieldCheck, 'Secure demo checkout']].map(([Icon, t]) => (
          <div key={t} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold"><Icon className="text-accent" size={20} />{t}</div>
        ))}
      </section>

      <section className="container-x grid gap-4 py-6 md:grid-cols-3">
        {[['Up to 20% off jewelery', 'jewelery', 'bg-amber-50'], ['New electronics', 'electronics', 'bg-blue-50'], ['Seasonal clothing', "men's clothing", 'bg-rose-50']].map(([t, c, bg]) => (
          <Link key={t} to={`/shop?cat=${encodeURIComponent(c)}`} className={`${bg} rounded-xl p-6 transition-shadow hover:shadow-md`}>
            <p className="text-lg font-bold">{t}</p><p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent">Browse <ArrowRight size={14} /></p>
          </Link>
        ))}
      </section>

      {error ? <div className="container-x py-10"><ErrorBox message={error} onRetry={retry} /></div> : (
        <>
          <Section title="Featured products" to="/shop">{loading ? <CardSkeletons n={4} /> : <Grid items={featured} />}</Section>
          <section className="container-x py-8">
            <h2 className="mb-4 text-2xl font-extrabold">Categories</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((c) => <Link key={c} to={`/shop?cat=${encodeURIComponent(c)}`} className="rounded-xl border border-slate-200 p-4 text-sm font-bold capitalize hover:border-accent hover:text-accent">{c}</Link>)}
            </div>
          </section>
          <Section title="Best sellers" to="/shop">{loading ? <CardSkeletons n={4} /> : <Grid items={best} />}</Section>
        </>
      )}

      <section className="container-x py-8">
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-extrabold">Get new arrivals in your inbox</h2>
          <p className="mt-2 text-sm text-slate-300">One email a month. Demo form: nothing is sent.</p>
          <form onSubmit={subscribe} className="mx-auto mt-5 flex max-w-md gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input !border-transparent text-slate-900" aria-label="Email" />
            <button className="btn-primary shrink-0">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}
const Grid = ({ items }) => <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
const Section = ({ title, to, children }) => (
  <section className="container-x py-8">
    <div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-extrabold">{title}</h2><Link to={to} className="text-sm font-semibold text-accent">See all</Link></div>
    {children}
  </section>
)
