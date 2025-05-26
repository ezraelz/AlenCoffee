import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { getCookie } from '../utils/csrf';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Login: React.FC = () => {
  const { setIsLoggedIn, isLoggedIn} = useAuth(); // ✅ Now using context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔐 Ensure session is initialized / check login status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/auth/status/', {
          withCredentials: true
        });
        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
          navigate('/'); // Redirect if already logged in
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, [setIsLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
        interface LoginResponse {
            username: string;
            password: string;
            email: string; // Added email property
            refresh: string; // Added refresh token property
            access: string; // Added access token property
          }

      const response = await axios.post<LoginResponse>('/api/login/', {
        username,
        password,
      });
  
      const { access, refresh, email: userEmail, username: userUsername} = response.data;
      

      // ✅ Save tokens and role to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('username', userUsername);
      localStorage.setItem('isLoggedIn', 'true');
  
      setIsLoggedIn(true);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    }
  };
  
  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-box">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="login-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="login-footer">
          <p>
            Forgot your password? <a href="/reset">Reset here</a>
          </p>
        </div>
    </div>
  );
};

export default Login;
