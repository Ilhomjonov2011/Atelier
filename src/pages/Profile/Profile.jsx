import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { Field } from '../../components/common/ui'
import { OrderList } from '../Orders/Orders'
import { clean, isEmail } from '../../utils'

export default function Profile() {
  const { user, updateUser, toast } = useStore()
  const [f, setF] = useState(user)
  const [errors, setErrors] = useState({})
  const submit = (e) => {
    e.preventDefault()
    const c = { name: clean(f.name), email: clean(f.email), phone: clean(f.phone), address: clean(f.address) }
    const errs = {}
    if (c.name.length < 2) errs.name = 'Enter your name.'
    if (!isEmail(c.email)) errs.email = 'Enter a valid email address.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    updateUser(c); toast('Profile saved')
  }
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold">Profile</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} noValidate className="panel space-y-4">
          <h2 className="font-extrabold">Your details</h2>
          <Field label="Name" error={errors.name}><input className="input mt-1" value={f.name} onChange={on('name')} maxLength={80} /></Field>
          <Field label="Email" error={errors.email}><input className="input mt-1" value={f.email} onChange={on('email')} maxLength={120} /></Field>
          <Field label="Phone"><input className="input mt-1" value={f.phone} onChange={on('phone')} maxLength={20} /></Field>
          <Field label="Address"><input className="input mt-1" value={f.address} onChange={on('address')} maxLength={160} /></Field>
          <button className="btn-primary">Save changes</button>
        </form>
        <div><h2 className="mb-3 font-extrabold">Recent orders</h2><OrderList limit={5} /></div>
      </div>
    </div>
  )
}
