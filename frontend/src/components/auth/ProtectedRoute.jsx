import React from 'react';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * 
 * Props:
 * - children: Component to render if authenticated
 * - requireOwner: If true, requires owner/broker account
 * - requireVerified: If true, requires email verification
 * - fallback: Where to redirect if not authenticated (default: 'login')
 */
function ProtectedRoute({ 
    children, 
    requireOwner = false, 
    requireVerified = false,
    fallback = 'login',
    onNavigate 
}) {
    const { user, loading, isAuthenticated, isOwner, isEmailVerified } = useFirebaseAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="protected-route-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        if (onNavigate) {
            onNavigate(fallback);
            return null;
        }
        return <Navigate to={`/${fallback}`} replace />;
    }

    // Requires owner but user is not owner
    if (requireOwner && !isOwner()) {
        return (
            <div className="access-denied">
                <h2>Access Denied</h2>
                <p>This area is for property owners only.</p>
                <button 
                    className="btn btn-primary"
                    onClick={() => onNavigate && onNavigate('owner-upgrade')}
                >
                    Become an Owner
                </button>
            </div>
        );
    }

    // Requires verified email
    if (requireVerified && !isEmailVerified()) {
        return (
            <div className="email-verification-required">
                <h2>Email Verification Required</h2>
                <p>Please verify your email address to access this feature.</p>
                <VerificationReminder />
            </div>
        );
    }

    return children;
}

/**
 * Email Verification Reminder Component
 */
function VerificationReminder() {
    const { resendVerificationEmail, checkEmailVerified } = useFirebaseAuth();
    const [sending, setSending] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    const [checking, setChecking] = React.useState(false);

    const handleResend = async () => {
        setSending(true);
        try {
            await resendVerificationEmail();
            setSent(true);
            setTimeout(() => setSent(false), 5000);
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleCheck = async () => {
        setChecking(true);
        try {
            const verified = await checkEmailVerified();
            if (verified) {
                window.location.reload(); // Refresh to update UI
            } else {
                alert('Email not yet verified. Please check your inbox.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="verification-actions">
            <button 
                className="btn btn-outline" 
                onClick={handleResend}
                disabled={sending || sent}
            >
                {sending ? 'Sending...' : sent ? 'Email Sent!' : 'Resend Verification Email'}
            </button>
            <button 
                className="btn btn-primary" 
                onClick={handleCheck}
                disabled={checking}
            >
                {checking ? 'Checking...' : 'I\'ve Verified My Email'}
            </button>
        </div>
    );
}

export default ProtectedRoute;
export { VerificationReminder };
