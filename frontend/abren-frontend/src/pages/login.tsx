import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/csrf';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Login: React.FC = () => {
  const { setIsLoggedIn } = useAuth(); // ✅ Now using context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔐 Ensure session is initialized / check login status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/status/', {
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
            access: string;
            refresh: string;
            role: string;
            email: string;
          }

      const csrfToken = getCookie('csrftoken');
      const response = await axios.post<LoginResponse>(
        'http://127.0.0.1:8000/api/login/',
        { email, password },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      const { access, refresh, role, email: userEmail } = response.data;
  
      // ✅ Save tokens and role to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('role', role);
      localStorage.setItem('email', userEmail);
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
    </div>
  );
};

export default Login;
