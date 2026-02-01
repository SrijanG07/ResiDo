import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ResiDo_token'));
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('ResiDo_token');
        const storedUser = localStorage.getItem('ResiDo_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details?.join(', ') || 'Login failed');
            }

            // Store token and user
            localStorage.setItem('ResiDo_token', data.token);
            localStorage.setItem('ResiDo_user', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (name, email, password, userType = 'buyer') => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, user_type: userType })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details?.join(', ') || 'Registration failed');
            }

            // Store token and user
            localStorage.setItem('ResiDo_token', data.token);
            localStorage.setItem('ResiDo_user', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('ResiDo_token');
        localStorage.removeItem('ResiDo_user');
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
