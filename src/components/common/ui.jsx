import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Star, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { STATUS_STYLE } from '../../constants'

export const Stars = memo(function Stars({ rate = 0, count }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      <Star size={14} className="fill-amber-400 text-amber-400" />
      <span className="font-semibold text-slate-700">{Number(rate).toFixed(1)}</span>
      {count != null && <span>({count})</span>}
    </span>
  )
})

export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />
export const CardSkeletons = ({ n = 8 }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="space-y-3"><Skeleton className="aspect-square" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/3" /></div>
    ))}
  </div>
)

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center" role="alert">
      <AlertTriangle className="mx-auto mb-2 text-red-500" />
      <p className="font-semibold text-red-700">Could not load data</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-primary mt-4">Try again</button>}
    </div>
  )
}

export function Empty({ icon: Icon, title, text, to, cta }) {
  return (
    <div className="mx-auto max-w-sm py-16 text-center">
      {Icon && <Icon className="mx-auto mb-3 text-slate-300" size={44} />}
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
      {to && <Link to={to} className="btn-primary mt-5">{cta}</Link>}
    </div>
  )
}

export const StatusBadge = ({ status }) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status] || ''}`}>{status}</span>

export function Field({ label, error, children }) {
  return <div><label className="label">{label}{children}</label>{error && <p className="err">{error}</p>}</div>
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button className="btn-ghost !px-2" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => onChange(n)} className={`h-10 w-10 rounded-lg text-sm font-semibold ${n === page ? 'bg-accent text-white' : 'hover:bg-slate-100'}`}>{n}</button>
      ))}
      <button className="btn-ghost !px-2" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </nav>
  )
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-in rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${t.type === 'err' ? 'bg-red-600' : 'bg-slate-900'}`}>{t.msg}</div>
      ))}
    </div>
  )
}
