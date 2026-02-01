import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import './AuthForms.css';

/**
 * Email Verification Component
 * Shows verification status and allows resending verification email
 */
function EmailVerification({ onContinue, onBack }) {
    const { 
        user, 
        firebaseUser, 
        resendVerificationEmail, 
        checkEmailVerified,
        isEmailVerified 
    } = useFirebaseAuth();
    
    const [checking, setChecking] = useState(false);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);

    // Check verification status periodically
    useEffect(() => {
        if (isEmailVerified()) {
            setVerified(true);
            return;
        }

        const interval = setInterval(async () => {
            const isVerified = await checkEmailVerified();
            if (isVerified) {
                setVerified(true);
                clearInterval(interval);
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [checkEmailVerified, isEmailVerified]);

    const handleResend = async () => {
        setResending(true);
        setError('');
        setResent(false);

        try {
            await resendVerificationEmail();
            setResent(true);
            setTimeout(() => setResent(false), 30000); // Reset after 30 seconds
        } catch (err) {
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    const handleCheckManually = async () => {
        setChecking(true);
        setError('');

        try {
            const isVerified = await checkEmailVerified();
            if (isVerified) {
                setVerified(true);
            } else {
                setError('Email not verified yet. Please check your inbox and click the verification link.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setChecking(false);
        }
    };

    if (verified) {
        return (
            <div className="email-verification success">
                <div className="verification-icon verified">✓</div>
                <h3>Email Verified!</h3>
                <p>Your email has been successfully verified. You now have full access to all ResiDo features.</p>
                <button 
                    className="btn btn-primary btn-block"
                    onClick={onContinue}
                >
                    Continue to ResiDo
                </button>
            </div>
        );
    }

    return (
        <div className="email-verification pending">
            <div className="verification-icon pending">✉️</div>
            <h3>Verify Your Email</h3>
            <p>
                We've sent a verification email to:
                <br />
                <strong>{user?.email || firebaseUser?.email}</strong>
            </p>
            
            <div className="verification-steps">
                <div className="step">
                    <span className="step-number">1</span>
                    <span>Open the email we sent you</span>
                </div>
                <div className="step">
                    <span className="step-number">2</span>
                    <span>Click the verification link</span>
                </div>
                <div className="step">
                    <span className="step-number">3</span>
                    <span>Return here and continue</span>
                </div>
            </div>

            {error && (
                <div className="auth-error">
                    <span className="error-icon">!</span>
                    {error}
                </div>
            )}

            <div className="verification-actions">
                <button
                    className="btn btn-primary btn-block"
                    onClick={handleCheckManually}
                    disabled={checking}
                >
                    {checking ? 'Checking...' : "I've Verified My Email"}
                </button>

                <button
                    className="btn btn-outline btn-block"
                    onClick={handleResend}
                    disabled={resending || resent}
                >
                    {resending ? 'Sending...' : resent ? 'Email Sent! (wait 30s)' : 'Resend Verification Email'}
                </button>
            </div>

            <div className="verification-help">
                <p>
                    <strong>Can't find the email?</strong>
                    <br />
                    Check your spam or junk folder. Make sure {user?.email || firebaseUser?.email} is correct.
                </p>
            </div>

            <button 
                className="btn btn-text"
                onClick={onContinue}
            >
                Skip for now (some features may be limited)
            </button>

            {onBack && (
                <button 
                    className="btn btn-text"
                    onClick={onBack}
                >
                    ← Back
                </button>
            )}
        </div>
    );
}

export default EmailVerification;
