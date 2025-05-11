import React, { useEffect, useState } from 'react';
import './sidebar.css';
import './topnav.css';
import './topnav';
import './adminPage.css'; // Adjust the import path as necessary

import Sidebar from './sidebar'; // Adjust the import path as necessary
import TopNav from './topnav';
import axios from 'axios';

const AdminPage: React.FC = () => {
    const [products, setProducts] = useState(0);
    const [stock, setStock] = useState(0);
    const [sales, setSales] = useState(0);
    const [users, setUsers] = useState('');
    const [orders, setOrders] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://127.0.0.1:8000/adminPanel/total-products/');
                setProducts(response.data.total_products);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://127.0.0.1:8000/adminPanel/total-stock/');
                setStock(response.data.total_stock);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://127.0.0.1:8000/adminPanel/total-sales/');
                setSales(response.data.total_sales);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://127.0.0.1:8000/adminPanel/users/');
                setUsers(response.data.length);
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://127.0.0.1:8000/adminPanel/orders/');
                setOrders(response.data.length);
            } catch (error) {
                console.error('Error fetching orders data:', error);
            }
        }
        fetchData();
    }, []);
    
    return (
        <div className='admin-page'>
            <TopNav />
            <Sidebar /> {/* Include the sidebar component */}
            <div className="cards container mt-5 mb-5 d-flex flex-wrap justify-content-center">
                <div className="card">
                    <h2>Products</h2>
                    <p>{products}</p>
                </div>
                <div className="card">
                    <h2>Stock</h2>
                    <p>{stock}</p>
                </div>
                <div className="card">
                    <h2>Sales</h2>
                    <p>{sales}</p>
                </div>
                <div className="card">
                    <h2>Users</h2>
                    <p>{users}</p>
                </div>
                <div className="card">
                    <h2>Orders</h2>
                    <p>{orders}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;