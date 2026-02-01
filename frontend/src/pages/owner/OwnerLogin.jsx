import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './OwnerLogin.css';

function OwnerLogin({ onSuccess, onBack, allowAllUsers = false }) {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);

            // Check if user is owner/broker (skip if allowAllUsers is true)
            if (!allowAllUsers && result.user.user_type !== 'owner' && result.user.user_type !== 'broker') {
                setError('Access denied. Owner or broker account required.');
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
            // Register as owner type
            await register(name, email, password, 'owner');
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
                <div className="login-logo">
                    <span className="logo-room">Resi</span>
                    <span className="logo-gi">Do</span>
                </div>

                <div className="login-header">
                    <h1>Property Owner</h1>
                    <p>{activeTab === 'signin' ? 'Sign in to manage your properties' : 'Create an owner account to list properties'}</p>
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
                        Create Account
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
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="owner@example.com"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignUp} className="login-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="signup-email">Email Address</label>
                            <input
                                type="email"
                                id="signup-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="owner@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="signup-password">Password</label>
                            <input
                                type="password"
                                id="signup-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
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
                            {loading ? 'Creating Account...' : 'Create Owner Account'}
                        </button>
                    </form>
                )}

                <button 
                    type="button"
                    className="btn-back-landing"
                    onClick={onBack}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

export default OwnerLogin;
