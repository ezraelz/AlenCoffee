import React, { useEffect, useState } from 'react';
import './sidebar.css';
import './topnav.css';
import './adminPage.css';

import Sidebar from './sidebar';
import TopNav from './topnav';
import axios from '../../utils/axios';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import { useNavigate, Navigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_joined: string;
}

const AdminPage: React.FC = () => {
    const [topProducts, setTopProducts] = useState<
    { id: number; name: string; popularity: number; sales: number }[]
    >([]);
    const [dailySales, setDailySales] = useState<{ day: string; total_sales: number }[]>([]);
    const [products, setProducts] = useState(0);
    const [stock, setStock] = useState(0);
    const [sales, setSales] = useState(0);
    const [orders, setOrders] = useState(0);
    const [users, setUsers] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { setShowNav, setShowFooter } = useNavVisibility();
    const navigate = useNavigate();

    useEffect(() => {
        setShowNav(false);
        setShowFooter(false);
        return () => {
            setShowNav(true);
            setShowFooter(true);
        };
    }, [setShowNav, setShowFooter]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError("You must be logged in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/users/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    navigate('/login');
                } else {
                    setError("Failed to load user.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchAllStats = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                const [
                    productsRes,
                    stockRes,
                    salesRes,
                    usersRes,
                    ordersRes,
                    topProductsRes,
                    salesPerDayRes
                ] = await Promise.all([
                    axios.get('/adminPanel/total-products/', config),
                    axios.get('/adminPanel/total-stock/', config),
                    axios.get('/adminPanel/total-sales/', config),
                    axios.get('/adminPanel/users/', config),
                    axios.get('/adminPanel/total-orders/', config),
                    axios.get('/adminPanel/top-products/', config),
                    axios.get('/adminPanel/sales-per-day/', config),
                ]);

                setProducts(productsRes.data.total_products);
                setStock(stockRes.data.total_stock);
                setSales(salesRes.data.total_sales);
                setUsers(usersRes.data.length);
                setOrders(ordersRes.data.total_orders);
                setTopProducts(topProductsRes.data);
                setDailySales(salesPerDayRes.data);

                console.log(salesPerDayRes.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError('Failed to load admin statistics.');
            }
        };

        fetchAllStats();
    }, []);

    if (loading) {
        return <div className="main">Verifying admin access...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admin-page">
            <TopNav />
            <Sidebar />
            {error && <div className="alert alert-danger w-100 text-center">{error}</div>}

            <div className="cards-container ">
                <div className="cards">

                    <div className="card">
                        <h2>Total Products</h2>
                        <p>{products}</p>
                        <small>
                            <p>Stock</p>
                            <p>{stock}</p>
                        </small>
                    </div>
                    
                    <div className="card">
                        <h2>Total Sales</h2>
                        <p>${sales}</p>
                    </div>
                    <div className="card">
                        <h2>Total Users</h2>
                        <p>{users}</p>
                    </div>
                    <div className="card">
                        <h2>Total Orders</h2>
                        <p>{orders > 0 ? orders.toLocaleString() : 'Loading...'}</p>
                    </div>
                </div>
                <div className="users-top-products">
                    <div className="top-products">
                        <h3>Top Products</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Popularity</th>
                                <th>Sales</th>
                            </tr>
                            </thead>
                            <tbody>
                                {topProducts.length > 0 ? (
                                    topProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.popularity}%</td>
                                        <td>${product.sales.toLocaleString()}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan={4} className="text-center">
                                        No top products found.
                                    </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="sales-per-day">
                        <h3>Sales Per Day</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailySales.length > 0 ? (
                                    dailySales.map((sale, index) => (
                                        <tr key={index}>
                                            <td>{sale.day}</td>
                                            <td>${sale.total_sales}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2}>No daily sales data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminPage;
