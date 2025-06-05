import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import './profile.css';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_joined: string;
    profile_image: string; // Added property
}


const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
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


    if (error) return <div className="error-message">{error}</div>;


    return (
        <div className="profile">
            <div className="profile-container">
                <img src={`http://127.0.0.1:8000${user?.profile_image}`} alt="Profile" />
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Date Joined:</strong> {user?.date_joined}</p>
            </div> 
        </div>
    );
};

export default Profile;
