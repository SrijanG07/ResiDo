import React, { useState } from 'react';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import LoginForm from './LoginForm';
import PasswordReset from './PasswordReset';
import EmailVerification from './EmailVerification';
import '../auth/AuthForms.css';

/**
 * Owner Authentication Component
 * Used on the List Property page for owner login/signup
 * Separated from general user auth flow
 */
function OwnerAuth({ onSuccess, onBack, onDemoMode }) {
    const { registerOwner, login, loginWithGoogle, isAuthenticated, isOwner, user } = useFirebaseAuth();
    const [view, setView] = useState('landing'); // landing, signin, signup, forgot-password, verify-email
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // If already authenticated as owner, redirect to success
    React.useEffect(() => {
        if (isAuthenticated && isOwner()) {
            onSuccess?.();
        }
    }, [isAuthenticated, isOwner, onSuccess]);

    // Owner Signup Form
    const OwnerSignupForm = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [phone, setPhone] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [formError, setFormError] = useState('');
        const [submitting, setSubmitting] = useState(false);

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
                setFormError('Please enter your name');
                return false;
            }
            if (!email.trim()) {
                setFormError('Please enter your email');
                return false;
            }
            if (password.length < 8) {
                setFormError('Password must be at least 8 characters');
                return false;
            }
            if (password !== confirmPassword) {
                setFormError('Passwords do not match');
                return false;
            }
            if (getPasswordStrength().level < 2) {
                setFormError('Please choose a stronger password');
                return false;
            }
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setFormError('');

            if (!validateForm()) return;

            setSubmitting(true);

            try {
                await registerOwner(name, email, password, phone || null);
                setRegistrationSuccess(true);
                setView('verify-email');
            } catch (err) {
                setFormError(err.message);
            } finally {
                setSubmitting(false);
            }
        };

        const passwordStrength = getPasswordStrength();

        return (
            <div className="auth-form">
                <div className="owner-auth-header">
                    <div className="owner-icon">O</div>
                    <h1>Create Owner Account</h1>
                    <p>Start listing your properties on ResiDo</p>
                </div>

                {formError && (
                    <div className="auth-error">
                        <span className="error-icon">!</span>
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="owner-name">Full Name *</label>
                        <input
                            type="text"
                            id="owner-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="owner-email">Email Address *</label>
                        <input
                            type="email"
                            id="owner-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="owner@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="owner-phone">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="owner-phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 9876543210"
                            autoComplete="tel"
                        />
                        <p className="form-hint">We'll use this for property inquiries</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="owner-password">Password *</label>
                        <input
                            type="password"
                            id="owner-password"
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
                        <p className="form-hint">Use 8+ characters with letters, numbers & symbols</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="owner-confirm-password">Confirm Password *</label>
                        <input
                            type="password"
                            id="owner-confirm-password"
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

                    <div className="form-group terms-group">
                        <label className="checkbox-label">
                            <input type="checkbox" required />
                            <span>
                                I agree to ResiDo's{' '}
                                <a href="/terms" target="_blank">Terms of Service</a>,{' '}
                                <a href="/privacy" target="_blank">Privacy Policy</a>, and{' '}
                                <a href="/owner-terms" target="_blank">Owner Agreement</a>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={submitting}
                    >
                        {submitting ? 'Creating Account...' : 'Create Owner Account'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <button
                    type="button"
                    className="btn btn-google btn-block"
                    onClick={async () => {
                        try {
                            await loginWithGoogle();
                            // After Google login, we may need to upgrade to owner
                            onSuccess?.();
                        } catch (err) {
                            setFormError(err.message);
                        }
                    }}
                    disabled={submitting}
                >
                    <svg viewBox="0 0 24 24" className="google-icon">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <button type="button" className="link-btn" onClick={() => setView('signin')}>
                        Sign in
                    </button>
                </p>
            </div>
        );
    };

    // Landing view - choice between signin, signup, demo
    if (view === 'landing') {
        return (
            <div className="owner-auth-page">
                <nav className="login-nav">
                    <button onClick={onBack} className="btn btn-text">
                        ← Back to ResiDo
                    </button>
                </nav>

                <div className="owner-auth-container">
                    <div className="owner-auth-header">
                        <div className="owner-icon">O</div>
                        <h1>Owner Hub</h1>
                        <p>List your property and reach thousands of potential buyers</p>
                    </div>

                    <div className="owner-auth-options">
                        <button 
                            className="btn btn-primary btn-block"
                            onClick={() => setView('signin')}
                        >
                            Sign In as Owner
                        </button>

                        <button 
                            className="btn btn-outline btn-block"
                            onClick={() => setView('signup')}
                            style={{ marginTop: '12px' }}
                        >
                            Create Owner Account
                        </button>

                        {onDemoMode && (
                            <button 
                                className="btn btn-text btn-block"
                                onClick={onDemoMode}
                                style={{ marginTop: '16px' }}
                            >
                                Try Demo Mode →
                            </button>
                        )}
                    </div>

                    <div className="owner-benefits">
                        <h4>Why list with ResiDo?</h4>
                        <div className="benefit-item">
                            <span className="benefit-icon">📊</span>
                            <span>Smart analytics dashboard</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">💰</span>
                            <span>AI-powered pricing suggestions</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🏠</span>
                            <span>360° virtual tours</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✅</span>
                            <span>Verified owner badges</span>
                        </div>
                    </div>

                    <div className="demo-banner">
                        <p>Demo credentials:</p>
                        <code>owner1@ResiDo.com / password123</code>
                    </div>
                </div>
            </div>
        );
    }

    // Sign In view
    if (view === 'signin') {
        return (
            <div className="owner-auth-page">
                <nav className="login-nav">
                    <button onClick={() => setView('landing')} className="btn btn-text">
                        ← Back
                    </button>
                </nav>

                <div className="owner-auth-container">
                    <div className="owner-auth-header">
                        <div className="owner-icon">O</div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to manage your properties</p>
                    </div>

                    <LoginForm 
                        onSuccess={onSuccess}
                        onForgotPassword={() => setView('forgot-password')}
                        onSwitchToSignup={() => setView('signup')}
                    />

                    <div className="demo-banner">
                        <p>Demo credentials:</p>
                        <code>owner1@ResiDo.com / password123</code>
                    </div>
                </div>
            </div>
        );
    }

    // Sign Up view
    if (view === 'signup') {
        return (
            <div className="owner-auth-page">
                <nav className="login-nav">
                    <button onClick={() => setView('landing')} className="btn btn-text">
                        ← Back
                    </button>
                </nav>

                <div className="owner-auth-container">
                    <OwnerSignupForm />
                </div>
            </div>
        );
    }

    // Forgot Password view
    if (view === 'forgot-password') {
        return (
            <div className="owner-auth-page">
                <nav className="login-nav">
                    <button onClick={() => setView('signin')} className="btn btn-text">
                        ← Back to Sign In
                    </button>
                </nav>

                <div className="owner-auth-container">
                    <PasswordReset 
                        onBack={() => setView('signin')}
                        onSuccess={() => setView('signin')}
                    />
                </div>
            </div>
        );
    }

    // Email Verification view
    if (view === 'verify-email') {
        return (
            <div className="owner-auth-page">
                <div className="owner-auth-container">
                    <EmailVerification 
                        onContinue={onSuccess}
                        onBack={() => setView('landing')}
                    />
                </div>
            </div>
        );
    }

    return null;
}

export default OwnerAuth;
