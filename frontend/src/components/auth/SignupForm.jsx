import React, { useState } from 'react';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import './AuthForms.css';

/**
 * Signup Form Component
 * For buyers/renters only - owners use OwnerSignupForm
 */
function SignupForm({ onSuccess, onSwitchToLogin }) {
    const { register, loginWithGoogle, clearError } = useFirebaseAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('buyer'); // buyer or renter only
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { level: 0, text: '', color: '' };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const levels = [
            { level: 1, text: 'Weak', color: '#ef4444' },
            { level: 2, text: 'Fair', color: '#f59e0b' },
            { level: 3, text: 'Good', color: '#eab308' },
            { level: 4, text: 'Strong', color: '#22c55e' },
            { level: 5, text: 'Very Strong', color: '#10b981' }
        ];

        return levels[Math.min(strength - 1, 4)] || { level: 0, text: '', color: '' };
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!email.trim()) {
            setError('Please enter your email');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (getPasswordStrength().level < 2) {
            setError('Please choose a stronger password');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const result = await register(name, email, password, userType);
            setSuccess(true);
            setTimeout(() => {
                onSuccess?.(result);
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithGoogle();
            onSuccess?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-success">
                <div className="success-icon">✓</div>
                <h3>Account Created!</h3>
                <p>
                    We've sent a verification email to <strong>{email}</strong>.
                    Please check your inbox and click the link to verify your account.
                </p>
                <p className="success-note">
                    You can still use ResiDo while waiting for verification.
                </p>
            </div>
        );
    }

    const passwordStrength = getPasswordStrength();

    return (
        <div className="auth-form">
            {error && (
                <div className="auth-error">
                    <span className="error-icon">!</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        autoComplete="name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-email">Email Address</label>
                    <input
                        type="email"
                        id="signup-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        autoComplete="email"
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
                        autoComplete="new-password"
                    />
                    {password && (
                        <div className="password-strength">
                            <div className="strength-bar">
                                <div 
                                    className="strength-fill" 
                                    style={{ 
                                        width: `${passwordStrength.level * 20}%`,
                                        backgroundColor: passwordStrength.color 
                                    }}
                                />
                            </div>
                            <span style={{ color: passwordStrength.color }}>
                                {passwordStrength.text}
                            </span>
                        </div>
                    )}
                    <p className="form-hint">
                        Use 8+ characters with a mix of letters, numbers & symbols
                    </p>
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
                        autoComplete="new-password"
                    />
                    {confirmPassword && password !== confirmPassword && (
                        <p className="form-error">Passwords don't match</p>
                    )}
                </div>

                <div className="form-group">
                    <label>I'm looking to</label>
                    <div className="user-type-selector">
                        <button
                            type="button"
                            className={`type-btn ${userType === 'buyer' ? 'active' : ''}`}
                            onClick={() => setUserType('buyer')}
                        >
                            <span className="type-icon">🏠</span>
                            Buy a Home
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${userType === 'renter' ? 'active' : ''}`}
                            onClick={() => setUserType('renter')}
                        >
                            <span className="type-icon">🔑</span>
                            Rent a Home
                        </button>
                    </div>
                </div>

                <div className="form-group terms-group">
                    <label className="checkbox-label">
                        <input type="checkbox" required />
                        <span>
                            I agree to ResiDo's{' '}
                            <a href="/terms" target="_blank">Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" target="_blank">Privacy Policy</a>
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="auth-divider">
                <span>or continue with</span>
            </div>

            <button
                type="button"
                className="btn btn-google btn-block"
                onClick={handleGoogleSignup}
                disabled={loading}
            >
                <svg viewBox="0 0 24 24" className="google-icon">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>

            {onSwitchToLogin && (
                <p className="auth-switch">
                    Already have an account?{' '}
                    <button type="button" className="link-btn" onClick={onSwitchToLogin}>
                        Sign in
                    </button>
                </p>
            )}

            <p className="owner-redirect">
                Want to list a property?{' '}
                <a href="#list-property">Go to List Property →</a>
            </p>
        </div>
    );
}

export default SignupForm;
