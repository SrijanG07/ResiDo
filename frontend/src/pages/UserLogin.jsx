import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './owner/OwnerLogin.css'; // Reuse owner login styles

function UserLogin({ onSuccess, onBack }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
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

    return (
        <div className="owner-login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-icon">👤</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your account</p>
                </div>

                {error && (
                    <div className="login-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
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

                <div className="login-footer">
                    <p>Test account: <strong>test@roomgi.com</strong> / <strong>test123</strong></p>
                </div>

                <button className="btn btn-text" onClick={onBack}>
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

export default UserLogin;
