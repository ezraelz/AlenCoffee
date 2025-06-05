import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './routes/ScrollToTop';
import { NavVisibilityProvider } from './context/NavVisibilityContext';
import Layout from './layout';
import Cart from './pages/shop/cart';
import AdminRoute from './routes/adminRoute';
import AdminRoutes from './routes/adminRoute';


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
              <Route path="/checkout/:step" element={<Checkout />} /> 
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:category" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

              {/* Admin Panel (Protected) */}
              <Route path="/*" element={<ProtectedRoute element={<AdminRoutes />} />} />
            </Routes>

          </Layout>
        </Suspense>
      </Router>
    </NavVisibilityProvider>
  );
};

export default App;
