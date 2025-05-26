import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
const Overview:React.FC = () => {
    const [topProducts, setTopProducts] = useState<
    { id: number; name: string; popularity: number; sales: number }[]
    >([]);
    const [dailySales, setDailySales] = useState<{ day: string; total_sales: number }[]>([]);
    const [products, setProducts] = useState(0);
    const [stock, setStock] = useState(0);
    const [sales, setSales] = useState(0);
    const [orders, setOrders] = useState(0);
    const [users, setUsers] = useState(0);
    const [error, setError] = useState<string | null>(null);

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

                console.log(salesRes.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError('Failed to load admin statistics.');
            }
        };

        fetchAllStats();
    }, []);

  return (
    <div className='overview'>
      <div className="cards-container ">
            {error && <div className="alert alert-danger w-100 text-center">{error}</div>}
            <div className="cards">

                <div className="card">
                    <p>{products}</p>
                    <h2>Total Products</h2>
                    <small>
                        <p>Stock</p>
                        <p>{stock}</p>
                    </small>
                </div>                  
                <div className="card">
                    <p>${sales}</p>
                    <h2>Total Sales</h2>
                </div>
                <div className="card">
                    <p>{users}</p>
                    <h2>Total Users</h2>
                </div>
                <div className="card">
                    <p>{orders > 0 ? orders.toLocaleString() : '0'}</p>
                    <h2>Total Orders</h2>
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
            <div className="sales-chart">
              <div className="sales-per-day-chart">
                <h3>Sales Per Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total_sales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Overview
