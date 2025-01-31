import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './App.css';

const Register = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://taskbloom-backend-1.onrender.com/api/auth/register', {
                username,
                email,
                password
            });
            
            login(response.data.token);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="auth-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                <button type="submit">Register</button>
            </form>
            <p className="auth-link">
                Already have an account? {' '}
                <button onClick={onSwitch} className="switch-button">
                    Login here
                </button>
            </p>
        </div>
    );
};

export default Register;
