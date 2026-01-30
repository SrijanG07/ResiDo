import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('roomgi_token'));
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('roomgi_token');
        const storedUser = localStorage.getItem('roomgi_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();

        // Store token and user
        localStorage.setItem('roomgi_token', data.token);
        localStorage.setItem('roomgi_user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const register = async (name, email, password, userType = 'buyer') => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, user_type: userType })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();

        // Store token and user
        localStorage.setItem('roomgi_token', data.token);
        localStorage.setItem('roomgi_user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const logout = () => {
        localStorage.removeItem('roomgi_token');
        localStorage.removeItem('roomgi_user');
        setToken(null);
        setUser(null);
    };

    const isOwner = () => {
        return user?.user_type === 'owner' || user?.user_type === 'broker';
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isOwner,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
