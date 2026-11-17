export const money = (n) => '$' + Number(n || 0).toFixed(2)
export const clean = (s) => String(s ?? '').replace(/[<>]/g, '').trim()
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)
export const isHttpUrl = (s) => { try { return ['http:', 'https:'].includes(new URL(s).protocol) } catch { return false } }
import { FREE_SHIPPING_OVER, SHIPPING_FEE } from '../constants'
export function totals(items) {
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE
  return { subtotal, shipping, total: subtotal + shipping }
}
