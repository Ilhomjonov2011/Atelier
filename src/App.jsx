import { lazy, Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import AdminGuard from './components/layout/AdminGuard'
import { Toasts, Skeleton } from './components/common/ui'

const L = (f) => lazy(f)
const Home = L(() => import('./pages/Home/Home'))
const Shop = L(() => import('./pages/Shop/Shop'))
const ProductDetails = L(() => import('./pages/ProductDetails/ProductDetails'))
const Cart = L(() => import('./pages/Cart/Cart'))
const Wishlist = L(() => import('./pages/Wishlist/Wishlist'))
const Checkout = L(() => import('./pages/Checkout/Checkout'))
const Orders = L(() => import('./pages/Orders/Orders'))
const Profile = L(() => import('./pages/Profile/Profile'))
const AdminLogin = L(() => import('./pages/Admin/AdminLogin'))
const Dashboard = L(() => import('./pages/Admin/Dashboard'))
const AdminProducts = L(() => import('./pages/Admin/AdminProducts'))
const ProductForm = L(() => import('./pages/Admin/ProductForm'))
const Categories = L(() => import('./pages/Admin/Categories'))
const AdminOrders = L(() => import('./pages/Admin/AdminOrders'))
const Customers = L(() => import('./pages/Admin/Customers'))
const Analytics = L(() => import('./pages/Admin/Analytics'))
const Settings = L(() => import('./pages/Admin/Settings'))

const NotFound = () => (
  <div className="py-24 text-center"><h1 className="text-3xl font-extrabold">Page not found</h1><p className="mt-2 text-slate-500">That address does not exist.</p><Link to="/" className="btn-primary mt-6">Back to home</Link></div>
)
export default function App() {
  return (
    <>
      <Suspense fallback={<div className="container-x py-10"><Skeleton className="h-64" /></div>}>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toasts />
    </>
  )
}
