import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './component/nav.css';
import './pages/home.css';
import './pages/shop/shop.css';
import './pages/login.css';
import './component/leftsidebar.css';
import './pages/shop/cart.css';
import './pages/shop/single_product.css'
import './pages/shop/checkout.css';
import './component/shoppingform.css';
import './component/home/trending_products.css';
import './component/home/homeStory.css';
import './component/home/hotDrinks.css';
import './pages/blog/blog.css';
import './pages/blog/catagories.css';
import Nav from './component/nav';
import Footer from './component/footer';

const Admin = lazy(() => import('./pages/admin/adminPage'));
const Shop = lazy(() => import('./pages/shop/shop'));
const Cart = lazy(() => import('./pages/shop/cart'));
const Home = lazy(() => import('./pages/home'));
const Login = lazy(() => import('./pages/login'));
const Blog = lazy(() => import('./pages/blog/blog'));
const News = lazy(() => import('./pages/blog/news'));
const Logout = lazy(() => import('./pages/logout'));
const SingleProduct = lazy(() => import('./pages/shop/signleProduct'));
const Checkout = lazy(() => import('./pages/shop/checkout'));
const PaymentSuccess = lazy(() => import('./pages/shop/pymentSuccess'));

import { ToastContainer } from 'react-toastify';

const App = () => {
  const isLoggedIn = localStorage.getItem('access_token') ? true : false;
  const isLoading = false;  // No need to use React state for loading here.

  // The useEffect will check if the user is authenticated, 
  // verify the access token and refresh token logic on every page load.
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      // If there's no access token, log out the user
      if (!accessToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/status/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });

        const data = await response.json();
        if (!data.isAuthenticated) {
          // If the user is not authenticated, attempt to refresh the token
          if (refreshToken) {
            const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
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
        }
      } catch (err) {
        console.error('Error verifying auth status', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <Router>
      <Nav isLoggedIn={isLoggedIn} />
      <ToastContainer position="top" autoClose={3000} />
      <Suspense fallback={<div className="main">Loading Page...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/payment-success/" element={<PaymentSuccess />} />

          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/news' element={<News /> } />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
