import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { useStore } from '../../store/useStore'
import { Field, Skeleton, ErrorBox } from '../../components/common/ui'
import { clean, isHttpUrl } from '../../utils'

function Form({ initial, categories }) {
  const save = useStore((s) => s.saveProduct)
  const toast = useStore((s) => s.toast)
  const nav = useNavigate()
  const [f, setF] = useState({ title: initial?.title || '', price: initial?.price ?? '', category: initial?.category || categories[0] || '', image: initial?.image || '', description: initial?.description || '' })
  const [errors, setErrors] = useState({})
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const c = { title: clean(f.title), price: +f.price, category: clean(f.category), image: clean(f.image), description: clean(f.description) }
    const er = {}
    if (c.title.length < 3) er.title = 'Title must be at least 3 characters.'
    if (!(c.price > 0)) er.price = 'Enter a price above 0.'
    if (!c.category) er.category = 'Choose a category.'
    if (!isHttpUrl(c.image)) er.image = 'Enter a valid http(s) image URL.'
    if (c.description.length < 10) er.description = 'Description must be at least 10 characters.'
    setErrors(er)
    if (Object.keys(er).length) return
    save({ ...(initial ? { ...initial, ...c } : c) })
    toast(initial ? 'Product updated' : 'Product created')
    nav('/admin/products')
  }
  return (
    <form onSubmit={submit} noValidate className="panel max-w-2xl space-y-4">
      <Field label="Title" error={errors.title}><input className="input mt-1" value={f.title} onChange={on('title')} maxLength={150} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (USD)" error={errors.price}><input type="number" step="0.01" min="0" className="input mt-1" value={f.price} onChange={on('price')} /></Field>
        <Field label="Category" error={errors.category}><select className="input mt-1 capitalize" value={f.category} onChange={on('category')}>{categories.map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <Field label="Image URL" error={errors.image}><input className="input mt-1" value={f.image} onChange={on('image')} placeholder="https://…" /></Field>
      <Field label="Description" error={errors.description}><textarea rows="4" className="input mt-1" value={f.description} onChange={on('description')} maxLength={1000} /></Field>
      <div className="flex gap-3"><button className="btn-primary">{initial ? 'Save changes' : 'Create product'}</button><button type="button" className="btn-ghost" onClick={() => nav('/admin/products')}>Cancel</button></div>
    </form>
  )
}
export default function ProductForm() {
  const { id } = useParams()
  const { products, categories, loading, error, retry } = useProducts()
  if (error) return <ErrorBox message={error} onRetry={retry} />
  if (loading) return <Skeleton className="h-96 max-w-2xl" />
  const initial = id ? products.find((p) => String(p.id) === id) : null
  if (id && !initial) return <p className="text-slate-500">Product not found.</p>
  return <div className="space-y-4"><h1 className="text-2xl font-extrabold">{id ? 'Edit product' : 'Add product'}</h1><Form key={id || 'new'} initial={initial} categories={categories} /></div>
}
