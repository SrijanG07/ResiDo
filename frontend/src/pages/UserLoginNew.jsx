import React, { useState } from 'react';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import PasswordReset from '../components/auth/PasswordReset';
import EmailVerification from '../components/auth/EmailVerification';
import '../components/auth/AuthForms.css';
import './owner/OwnerLogin.css';

/**
 * User Login Page
 * For BUYERS and RENTERS only
 * Property owners should use the List Property flow (OwnerAuth)
 */
function UserLogin({ onSuccess, onBack }) {
    const { isAuthenticated, user } = useFirebaseAuth();
    const [view, setView] = useState('signin'); // signin, signup, forgot-password, verify-email

    // If already authenticated, redirect
    React.useEffect(() => {
        if (isAuthenticated && user) {
            onSuccess?.();
        }
    }, [isAuthenticated, user, onSuccess]);

    const handleAuthSuccess = (result) => {
        // If email verification is needed, show verification screen
        if (result?.emailVerificationSent) {
            setView('verify-email');
        } else {
            onSuccess?.();
        }
    };

    // Sign In View
    if (view === 'signin') {
        return (
            <div className="owner-login-page">
                <div className="login-container">
                    <div className="login-header">
                        <div className="login-icon">U</div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your account</p>
                    </div>

                    {/* Tabs */}
                    <div className="login-tabs">
                        <button
                            className="login-tab active"
                            onClick={() => setView('signin')}
                        >
                            Sign In
                        </button>
                        <button
                            className="login-tab"
                            onClick={() => setView('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    <LoginForm 
                        onSuccess={onSuccess}
                        onForgotPassword={() => setView('forgot-password')}
                        onSwitchToSignup={() => setView('signup')}
                    />

                    <div className="owner-redirect-banner">
                        <p>
                            <strong>Want to list a property?</strong>
                            <br />
                            <span>Go to "List Property" from the home page to create an owner account.</span>
                        </p>
                    </div>

                    <button className="btn btn-text" onClick={onBack}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Sign Up View (Buyers/Renters ONLY)
    if (view === 'signup') {
        return (
            <div className="owner-login-page">
                <div className="login-container">
                    <div className="login-header">
                        <div className="login-icon">U</div>
                        <h1>Create Account</h1>
                        <p>Join ResiDo to save properties and connect with owners</p>
                    </div>

                    {/* Tabs */}
                    <div className="login-tabs">
                        <button
                            className="login-tab"
                            onClick={() => setView('signin')}
                        >
                            Sign In
                        </button>
                        <button
                            className="login-tab active"
                            onClick={() => setView('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    <SignupForm 
                        onSuccess={handleAuthSuccess}
                        onSwitchToLogin={() => setView('signin')}
                    />

                    <button className="btn btn-text" onClick={onBack}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Forgot Password View
    if (view === 'forgot-password') {
        return (
            <div className="owner-login-page">
                <div className="login-container">
                    <PasswordReset 
                        onBack={() => setView('signin')}
                        onSuccess={() => setView('signin')}
                    />
                </div>
            </div>
        );
    }

    // Email Verification View
    if (view === 'verify-email') {
        return (
            <div className="owner-login-page">
                <div className="login-container">
                    <EmailVerification 
                        onContinue={onSuccess}
                        onBack={() => setView('signin')}
                    />
                </div>
            </div>
        );
    }

    return null;
}

export default UserLogin;
