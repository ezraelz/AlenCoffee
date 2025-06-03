import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './routes/ScrollToTop';
import { NavVisibilityProvider } from './context/NavVisibilityContext';
import Layout from './layout';
import Cart from './pages/shop/cart';
import OrderList from './pages/admin/orders/orderList';
import OrderCreate from './pages/admin/orders/orderCreate';
import UsersList from './pages/admin/users/usersList';
import UserCreate from './pages/admin/users/userCreate';
import UserUpdate from './pages/admin/users/userUpdate';
import UserDetail from './pages/admin/users/UserDetail';
import ProductManagement from './pages/admin/product/productMnanagement';
import InvoiceManagement from './pages/admin/invoice/invoiceManagement';
import BlogManagement from './pages/admin/blog/blogManagement';
import Help from './pages/admin/help/help';
import AdminPage from './pages/admin/adminPage';
import OrderDetail from './pages/admin/orders/orderDetail';
import ProductList from './pages/admin/product/productList';
import ProductUpdate from './pages/admin/product/productUpdate';
import ProductDetail from './pages/admin/product/productDetail';
import ProductCreate from './pages/admin/product/productCreate';
import Invoices from './pages/admin/invoice/invoiceList';
import AddInvoice from './pages/admin/invoice/addInvoice';
import InvoiceDetail from './pages/admin/invoice/invoiceDetail';
import Report from './pages/admin/report/report';

// Lazy loaded pages
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about'));
const Contact = lazy(() => import('./pages/contact'));
const Login = lazy(() => import('./pages/login'));
const Logout = lazy(() => import('./pages/logout'));
const Register = lazy(() => import('./pages/register'));
const Services = lazy(() => import('./pages/services'));
const Subscription = lazy(() => import('./pages/subscription'));
const Gifts = lazy(() => import('./pages/gifts'));

const Shop = lazy(() => import('./pages/shop/shop'));
const SingleProduct = lazy(() => import('./pages/shop/signleProduct'));
const Checkout = lazy(() => import('./pages/shop/checkout'));
const PaymentSuccess = lazy(() => import('./pages/shop/pymentSuccess'));

const Blog = lazy(() => import('./pages/blog/blog'));
const BlogDetail = lazy(() => import('./pages/blog/blogDetail'));

const Profile = lazy(() => import('./pages/profile/profileManagement'));

// Admin pages
const Admin = lazy(() => import('./pages/admin/adminPage'));
const Overview = lazy(() => import('./pages/admin/overview'));
const UsersManagement = lazy(() => import('./pages/admin/users/usersManagement'));
const OrderManagement = lazy(() => import('./pages/admin/orders/orderManagement'));

// Protected route wrapper
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem('access_token');
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Check authentication status & refresh token if needed
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/status/', {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });

        const data = await response.json();
        if (!data.isAuthenticated && refreshToken) {
          const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
            credentials: 'include',
          });

          const refreshData = await refreshResponse.json();
          if (refreshData.access) {
            localStorage.setItem('access_token', refreshData.access);
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <NavVisibilityProvider>
      <Router>
        <Cart isCartOpen={isCartOpen} closeCart={closeCart} />
        <ToastContainer position="top-right" autoClose={3000} />
        <Suspense fallback={<div className="main">Loading Page...</div>}>
          <ScrollToTop />
          <Layout
            isCartOpen={isCartOpen}
            openCart={openCart}
            closeCart={closeCart}
            isLoggedIn={!!localStorage.getItem('access_token')}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<Services />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<SingleProduct handleAddToCart={(product) => console.log('Add to cart:', product)} />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:category" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

              {/* Admin Panel (Protected) */}
              <Route path="/admin/" element={<ProtectedRoute element={<AdminPage />} />}>
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="/admin/products" element={<ProductManagement />} >
                  <Route index element={<ProductList />} />
                  <Route path="add" element={<ProductCreate />} />
                  <Route path="update/:id" element={<ProductUpdate />} />
                  <Route path="detail/:id" element={<ProductDetail />} />
                </Route>

                <Route path="/admin/users" element={<UsersManagement />}>
                  <Route index element={<UsersList />} />
                  <Route path="add" element={<UserCreate />} />
                  <Route path="update/:id" element={<UserUpdate />} />
                  <Route path="detail/:id" element={<UserDetail />} />
                </Route>

                <Route path="/admin/orders" element={<OrderManagement />} >
                  <Route index element={<OrderList />} />
                  <Route path="add" element={<OrderCreate />} />
                  <Route path="update/:id" element={<UserUpdate />} />
                  <Route path="detail/:id" element={<OrderDetail />} />
                </Route>
                
                <Route path="/admin/invoices" element={<InvoiceManagement />} >
                  <Route index element={<Invoices />} />
                  <Route path="add" element={<AddInvoice />} />
                  <Route path="update/:id" element={<UserUpdate />} />
                  <Route path="detail/:id" element={<InvoiceDetail />} />
                </Route>

                <Route path='report' element={<Report />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="help" element={<Help />} />
              </Route>

            </Routes>
          </Layout>
        </Suspense>
      </Router>
    </NavVisibilityProvider>
  );
};

export default App;
