import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './owner/OwnerLogin.css';

function UserLogin({ onSuccess, onBack }) {
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
            await login(email, password);
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
            await register(name, email, password, userType);
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
                    <div className="login-icon">U</div>
                    <h1>{activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{activeTab === 'signin' ? 'Sign in to access your account' : 'Join RoomGi to save properties and connect with owners'}</p>
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
                        <span>!</span> {error}
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

                        <div className="form-group">
                            <label>I am a</label>
                            <div className="login-tabs" style={{ marginBottom: 0 }}>
                                <button
                                    type="button"
                                    className={`login-tab ${userType === 'buyer' ? 'active' : ''}`}
                                    onClick={() => setUserType('buyer')}
                                >
                                    Buyer / Renter
                                </button>
                                <button
                                    type="button"
                                    className={`login-tab ${userType === 'owner' ? 'active' : ''}`}
                                    onClick={() => setUserType('owner')}
                                >
                                    Property Owner
                                </button>
                            </div>
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

                <button className="btn btn-text" onClick={onBack}>
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

export default UserLogin;
