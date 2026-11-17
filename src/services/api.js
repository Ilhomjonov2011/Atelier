const BASE = import.meta.env.VITE_API_URL || 'https://fakestoreapi.com'
const cache = new Map() // de-duplicates in-flight and repeated GET requests

async function request(path, opts = {}, ms = 8000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(BASE + path, { ...opts, signal: ctrl.signal, headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.status === 401 ? 'Incorrect username or password.' : `Server responded with ${res.status}.`)
    const type = res.headers.get('content-type') || ''
    return type.includes('json') ? await res.json() : await res.text()
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('The request timed out. Please try again.')
    if (e instanceof TypeError) throw new Error('Network error. Check your connection and try again.')
    throw e
  } finally { clearTimeout(timer) }
}
const get = (path) => {
  if (!cache.has(path)) cache.set(path, request(path).catch((e) => { cache.delete(path); throw e }))
  return cache.get(path)
}
export const api = {
  products: () => get('/products'),
  product: (id) => get('/products/' + id),
  categories: () => get('/products/categories'),
  byCategory: (c) => get('/products/category/' + encodeURIComponent(c)),
  carts: () => get('/carts'),
  users: () => get('/users'),
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  clear: () => cache.clear(),
}
