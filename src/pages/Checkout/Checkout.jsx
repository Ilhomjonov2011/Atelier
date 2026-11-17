import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Field } from '../../components/common/ui'
import { Summary } from '../Cart/Cart'
import { clean, isEmail, money, totals } from '../../utils'

const validate = (f) => {
  const e = {}
  if (f.name.length < 2) e.name = 'Enter your full name.'
  if (!isEmail(f.email)) e.email = 'Enter a valid email address.'
  if (!/^[+\d][\d\s()-]{6,17}$/.test(f.phone)) e.phone = 'Enter a valid phone number.'
  if (f.address.length < 5) e.address = 'Enter your street address.'
  if (f.city.length < 2) e.city = 'Enter your city.'
  if (!/^[A-Za-z0-9 -]{3,10}$/.test(f.zip)) e.zip = 'Enter a valid postal code.'
  return e
}
export default function Checkout() {
  const { cart, user, placeOrder, toast } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '', city: '', zip: '' })
  const [errors, setErrors] = useState({})
  if (!cart.length) return <Navigate to="/cart" replace />
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const c = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, clean(v)]))
    const errs = validate(c)
    setErrors(errs)
    if (Object.keys(errs).length) return toast('Please fix the highlighted fields', 'err')
    const id = placeOrder(c, cart, totals(cart).total)
    toast('Order placed (demo)')
    nav(`/orders/${id}`, { state: { placed: true } })
  }
  const field = (k, label, props = {}) => <Field label={label} error={errors[k]}><input className="input mt-1" value={f[k]} onChange={on(k)} maxLength={120} {...props} /></Field>
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <form onSubmit={submit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="panel space-y-4">
          <h2 className="font-extrabold">Customer and delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">{field('name', 'Full name', { autoComplete: 'name' })}{field('email', 'Email', { type: 'email', autoComplete: 'email' })}</div>
          {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
          {field('address', 'Street address', { autoComplete: 'street-address' })}
          <div className="grid gap-4 sm:grid-cols-2">{field('city', 'City')}{field('zip', 'Postal code')}</div>
          <p className="text-xs text-slate-500">Demo checkout: no payment is taken and no card details are collected.</p>
        </div>
        <aside className="panel h-fit">
          <h2 className="mb-3 font-extrabold">Order summary</h2>
          <ul className="mb-4 space-y-2 text-sm">{cart.map((i) => <li key={i.id} className="flex justify-between gap-3"><span className="line-clamp-1">{i.qty} × {i.title}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
          <Summary items={cart} />
          <button className="btn-primary mt-5 w-full">Place demo order</button>
        </aside>
      </form>
    </div>
  )
}
