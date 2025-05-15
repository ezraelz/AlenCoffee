import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_joined: string;
}

interface Shipping {
    session_key: string;
    full_name: string;
    email: string;
    user: string;
    address1: string;
    address2: string;
    city: string;
    status: string;
    zipcode: number;
    country: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Shipping | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError("You must be logged in to view your profile.");
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
                    setError("Session expired. Please log in again.");
                    localStorage.removeItem('access_token');
                    navigate('/login');
                } else {
                    setError("Failed to load profile.");
                }
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchShipping = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            try {
                const response = await axios.get('/orders/shipping/list/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Shipping Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    setShippingAddress(response.data[0]); // If it's a list, take the first
                } else {
                    setShippingAddress(null);
                }
            } catch (error: any) {
                console.error("Shipping fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShipping();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="profile">
            <div className="profile-hero">
                <h1>Profile Page</h1>
            </div>

            <div className="profile-container">
                <h2>Account Details</h2>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>First Name:</strong> {user?.first_name}</p>
                <p><strong>Last Name:</strong> {user?.last_name}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Date Joined:</strong> {user?.date_joined}</p>
            </div>

            <div className="shipping-container">
                <h2>Shipping Address</h2>
                {shippingAddress ? (
                    <>
                        <p><strong>Name:</strong> {shippingAddress.full_name}</p>
                        <p><strong>Email:</strong> {shippingAddress.email}</p>
                        <p><strong>Address 1:</strong> {shippingAddress.address1}</p>
                        <p><strong>Address 2:</strong> {shippingAddress.address2}</p>
                        <p><strong>City:</strong> {shippingAddress.city}</p>
                        <p><strong>Status:</strong> {shippingAddress.status}</p>
                        <p><strong>Zipcode:</strong> {shippingAddress.zipcode}</p>
                        <p><strong>Country:</strong> {shippingAddress.country}</p>
                    </>
                ) : (
                    <p>No shipping address found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
