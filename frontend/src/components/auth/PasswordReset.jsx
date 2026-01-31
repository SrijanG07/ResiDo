import React, { useState } from 'react';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import './AuthForms.css';

/**
 * Password Reset Component
 * Handles forgot password flow with Firebase
 */
function PasswordReset({ onBack, onSuccess }) {
    const { resetPassword } = useFirebaseAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="auth-form password-reset-success">
                <div className="success-icon-large">✉️</div>
                <h3>Check Your Email</h3>
                <p>
                    We've sent password reset instructions to <strong>{email}</strong>.
                </p>
                <p className="reset-instructions">
                    Click the link in the email to create a new password.
                    If you don't see the email, check your spam folder.
                </p>
                <button 
                    className="btn btn-primary btn-block"
                    onClick={onSuccess || onBack}
                >
                    Back to Login
                </button>
                <button 
                    className="btn btn-text"
                    onClick={() => {
                        setSent(false);
                        setEmail('');
                    }}
                >
                    Didn't receive email? Try again
                </button>
            </div>
        );
    }

    return (
        <div className="auth-form password-reset">
            <div className="reset-header">
                <h3>Reset Password</h3>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            {error && (
                <div className="auth-error">
                    <span className="error-icon">!</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="reset-email">Email Address</label>
                    <input
                        type="email"
                        id="reset-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        autoComplete="email"
                        autoFocus
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <button 
                className="btn btn-text"
                onClick={onBack}
            >
                ← Back to Login
            </button>
        </div>
    );
}

export default PasswordReset;
