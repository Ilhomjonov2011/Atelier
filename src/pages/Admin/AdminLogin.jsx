import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useStore } from '../../store/useStore'
import { DEMO_ADMIN } from '../../constants'

export default function AdminLogin() {
  const { admin, loginAdmin } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState({ username: '', password: '' })
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  if (admin) return <Navigate to="/admin" replace />
  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (!f.username.trim() || !f.password) return setErr('Enter a username and password.')
    setBusy(true)
    try { await api.login(f.username.trim(), f.password); loginAdmin(); nav('/admin') } // password is never stored
    catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="panel w-full max-w-sm space-y-4">
        <h1 className="text-xl font-extrabold">Admin sign in</h1>
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Demo authentication through FakeStoreAPI. Any signed-in browser user could edit this flag, so this is not production security.</p>
        <div><label className="label" htmlFor="u">Username</label><input id="u" className="input" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} autoComplete="username" /></div>
        <div><label className="label" htmlFor="p">Password</label><input id="p" type="password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></div>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <button type="button" className="btn-ghost w-full" onClick={() => setF(DEMO_ADMIN)}>Fill demo credentials</button>
        <Link to="/" className="block text-center text-sm text-accent">Back to store</Link>
      </form>
    </div>
  )
}
