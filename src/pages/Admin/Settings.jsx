import { useStore } from '../../store/useStore'

export default function Settings() {
  const { resetDemo, toast } = useStore()
  const reset = () => { if (window.confirm('Erase demo products, orders, cart and wishlist from this browser?')) { resetDemo(); toast('Demo data reset') } }
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold">Settings</h1>
      <div className="panel"><h2 className="font-extrabold">Demo data</h2><p className="mt-1 text-sm text-slate-500">Everything you create here lives in this browser's LocalStorage. FakeStoreAPI does not save writes.</p><button onClick={reset} className="btn-danger mt-4">Reset demo data</button></div>
      <div className="panel text-sm text-slate-600"><h2 className="font-extrabold text-slate-900">Before going to production</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>Real authentication with hashed passwords and server-side sessions or signed tokens.</li><li>Server-side role checks on every admin API. Client-side guards only hide the UI.</li><li>A real database for products, orders and customers, with server-side validation.</li><li>A payment provider and server-created orders. No payment happens in this demo.</li><li>HTTPS, rate limiting, CSRF protection and security headers.</li></ul></div>
    </div>
  )
}
