import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './owner/OwnerLogin.css';

function UserLogin({ onSuccess, onBack, onNavigate }) {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('buyer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            
            // Check if user is a buyer or renter (not owner/broker)
            if (result.user.user_type === 'owner' || result.user.user_type === 'broker') {
                setError('This login is for buyers/renters only. Please use the Owner Login.');
                setLoading(false);
                return;
            }
            
            onSuccess();
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Always register as buyer from this page
            await register(name, email, password, 'buyer');
            onSuccess();
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="owner-login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">Resi<span>Do</span></div>
                    <h1>{activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{activeTab === 'signin' ? 'Sign in to access your account' : 'Join ResiDo to save properties and connect with owners'}</p>
                </div>

                {/* Tabs */}
                <div className="login-tabs">
                    <button
                        className={`login-tab ${activeTab === 'signin' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('signin'); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('signup'); setError(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <div className="login-error">
                        <span>⚠</span> {error}
                    </div>
                )}

                {activeTab === 'signin' ? (
                    <form onSubmit={handleSignIn} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="forgot-password">
                            <a href="#" onClick={(e) => { e.preventDefault(); }}>Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignUp} className="login-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                )}

                {/* Owner Login Divider */}
                <div className="owner-login-divider">
                    <span>or</span>
                </div>

                {/* Owner Redirect Section */}
                <div className="owner-redirect-section">
                    <p className="owner-question">Are you a property owner?</p>
                    <button 
                        className="btn-owner-redirect"
                        onClick={() => onNavigate ? onNavigate('owner-landing') : null}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        List Your Property
                    </button>
                </div>

                <button className="btn btn-text" onClick={onBack}>
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

export default UserLogin;
