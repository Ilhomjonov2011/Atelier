import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const empty = { added: [], edited: {}, deleted: [], cats: [] }
const isCustom = (id) => String(id).startsWith('c-')
export const useStore = create(
  persist(
    (set, get) => ({
      cart: [], wishlist: [], orders: [], statuses: {}, custom: empty,
      user: { name: 'Demo Customer', email: 'demo@atelier.shop', phone: '', address: '' },
      admin: false, toasts: [],

      toast: (msg, type = 'ok') => {
        const id = Date.now() + Math.random()
        set((s) => ({ toasts: [...s.toasts, { id, msg, type }] }))
        setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
      },
      addCart: (p, qty = 1) => {
        set((s) => {
          const ex = s.cart.find((i) => i.id === p.id)
          if (ex) return { cart: s.cart.map((i) => (i.id === p.id ? { ...i, qty: Math.min(99, i.qty + qty) } : i)) }
          return { cart: [...s.cart, { id: p.id, title: p.title, price: p.price, image: p.image, qty }] }
        })
        get().toast('Added to cart')
      },
      setQty: (id, qty) => set((s) => ({ cart: s.cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)) })),
      removeCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),
      toggleWish: (p) => {
        const has = get().wishlist.some((w) => w.id === p.id)
        set((s) => ({ wishlist: has ? s.wishlist.filter((w) => w.id !== p.id) : [...s.wishlist, { id: p.id, title: p.title, price: p.price, image: p.image, category: p.category, rating: p.rating }] }))
        get().toast(has ? 'Removed from wishlist' : 'Saved to wishlist')
      },
      placeOrder: (customer, items, total) => {
        const id = 'ORD-' + Date.now().toString(36).toUpperCase()
        set((s) => ({ orders: [{ id, date: new Date().toISOString(), status: 'Pending', customer, items, total }, ...s.orders], cart: [] }))
        return id
      },
      setStatus: (id, status) => { set((s) => ({ statuses: { ...s.statuses, [id]: status } })); get().toast('Order status updated') },
      updateUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),
      saveProduct: (p) => set((s) => {
        const c = s.custom
        if (!p.id) return { custom: { ...c, added: [{ ...p, id: 'c-' + Date.now(), rating: { rate: 0, count: 0 } }, ...c.added] } }
        if (isCustom(p.id)) return { custom: { ...c, added: c.added.map((x) => (x.id === p.id ? { ...x, ...p } : x)) } }
        return { custom: { ...c, edited: { ...c.edited, [p.id]: p } } }
      }),
      deleteProduct: (id) => set((s) => {
        const c = s.custom
        const rest = { cart: s.cart.filter((i) => i.id !== id), wishlist: s.wishlist.filter((i) => i.id !== id) }
        return isCustom(id) ? { ...rest, custom: { ...c, added: c.added.filter((x) => x.id !== id) } } : { ...rest, custom: { ...c, deleted: [...c.deleted, id] } }
      }),
      addCat: (name) => set((s) => ({ custom: { ...s.custom, cats: [...new Set([...s.custom.cats, name])] } })),
      delCat: (name) => set((s) => ({ custom: { ...s.custom, cats: s.custom.cats.filter((c) => c !== name) } })),
      loginAdmin: () => set({ admin: true }),
      logoutAdmin: () => set({ admin: false }),
      resetDemo: () => set({ cart: [], wishlist: [], orders: [], statuses: {}, custom: empty }),
    }),
    { name: 'atelier-demo-v1', partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, orders: s.orders, statuses: s.statuses, custom: s.custom, user: s.user, admin: s.admin }) }
  )
)
