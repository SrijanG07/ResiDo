import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './OwnerLogin.css';

function OwnerLogin({ onSuccess, onBack }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);

            // Check if user is owner/broker
            if (result.user.user_type !== 'owner' && result.user.user_type !== 'broker') {
                setError('Access denied. Owner or broker account required.');
                return;
            }

            onSuccess();
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="owner-login">
            <nav className="login-nav">
                <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="back-link">
                    ← Back
                </a>
            </nav>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">🏠</div>
                        <h1>Owner Hub</h1>
                        <p>Sign in to manage your properties</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
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

                    <div className="login-footer">
                        <p>Don't have an account?</p>
                        <button className="btn btn-outline" disabled>
                            Sign Up (Coming Soon)
                        </button>
                    </div>

                    <div className="login-demo">
                        <p>Demo credentials:</p>
                        <code>owner1@roomgi.com / password123</code>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OwnerLogin;
