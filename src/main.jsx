import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.jsx'
import AuthProvider from './auth/AuthProvider.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import RequireRole from './auth/RequireRole.jsx'
import ShopProvider from './shop/ShopProvider.jsx'
import { AdminRoles, UserRoles } from './constants/userConstants.js'
import Home from './routes/home/Home.jsx'
import Women from './routes/women/Women.jsx'
import Men from './routes/men/Men.jsx'
import New from './routes/new/New.jsx'
import Sale from './routes/sale/Sale.jsx'
import Wishlist from './routes/wishlist/Wishlist.jsx'
import Cart from './routes/cart/Cart.jsx'
import Login from './routes/login/Login.jsx'
import AdminLogin from './routes/login-admin/AdminLogin.jsx'
import Register from './routes/register/Register.jsx'
import Callback from './routes/auth/Callback.jsx'
import Account from './routes/account/Account.jsx'
import Dashboard from './routes/admin/Dashboard.jsx'
import Admins from './routes/admin/Admins.jsx'
import NotFound from './routes/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <Routes>
            {/* Landing page — no footer, it closes on its own CTA. */}
            <Route element={<App withFooter={false} />}>
              <Route index element={<Home />} />
            </Route>

            {/* No storefront chrome, no nav link anywhere — reachable only
                by typing the URL. */}
            <Route path="login-admin" element={<AdminLogin />} />

            <Route element={<App />}>
              <Route path="women" element={<Women />} />
              <Route path="men" element={<Men />} />
              <Route path="new" element={<New />} />
              <Route path="sale" element={<Sale />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              {/* FRONTEND_POST_LOGIN_URL points here. */}
              <Route path="auth/callback" element={<Callback />} />
              <Route element={<RequireAuth />}>
                <Route path="account" element={<Account />} />
              </Route>
              <Route element={<RequireRole roles={AdminRoles} />}>
                <Route path="admin/dashboard" element={<Dashboard />} />
                <Route element={<RequireRole roles={[UserRoles.SuperAdmin]} />}>
                  <Route path="admin/admins" element={<Admins />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
