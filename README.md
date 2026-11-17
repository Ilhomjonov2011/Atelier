# Atelier — Premium E-commerce Demo

React + Vite + Tailwind CSS v4 storefront with a separate admin dashboard. Products come from [FakeStoreAPI](https://fakestoreapi.com); everything you change is stored in your browser (LocalStorage).

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```
Optional: copy `.env.example` to `.env` to change the API base URL.

## Features
- Customer: Home, Shop (search, category, price, rating, sort, pagination), Product details, Cart, Wishlist, Checkout with validation, Orders, Profile.
- Admin (`/admin`): Dashboard, Products (create/edit/delete/search/filter/sort), Categories, Orders (status changes), Customers, Analytics, Settings.
- Admin sign-in uses FakeStoreAPI `POST /auth/login`. Demo login: `mor_2314` / `83r5^_` (button on the login page fills it).
- Admin "orders" and "customers" are built from FakeStoreAPI `/carts` and `/users`, plus orders you place in the store.

## Security notes
This is a front-end demo. The admin guard and role flag live in the browser, so anyone can bypass them. Passwords are never stored, inputs are validated and stripped of `<>`, and React escapes all rendered text. Before production you need: real authentication and sessions, server-side authorization on every admin API, a real database, server-side validation, a payment provider, HTTPS, rate limiting and CSRF protection.

## Structure
`src/` — `components/`, `pages/`, `layouts/`, `hooks/`, `store/` (Zustand + persist), `services/` (API layer with timeout and request de-duplication), `utils/`, `constants/`, `styles/`.
