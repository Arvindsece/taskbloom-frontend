import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './App.css';

const Login = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://taskbloom-backend-1.onrender.com/api/auth/login', {
                email,
                password
            });
            
            login(response.data.token);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p className="auth-link">
                Don't have an account? {' '}
                <button onClick={onSwitch} className="switch-button">
                    Register here
                </button>
            </p>
        </div>
    );
};

export default Login;
