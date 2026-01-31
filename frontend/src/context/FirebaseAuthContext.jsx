import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    auth, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle,
    sendVerificationEmail,
    sendPasswordReset,
    logOut,
    updateUserProfile,
    onAuthChange
} from '../config/firebase';

const FirebaseAuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Firebase Auth Provider - Hybrid approach
 * Firebase handles: Authentication, user sessions, email verification
 * PostgreSQL handles: User profiles, properties, inquiries, reviews
 */
export function FirebaseAuthProvider({ children }) {
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Listen for Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setFirebaseUser(firebaseUser);
            
            if (firebaseUser) {
                // Sync with PostgreSQL backend
                try {
                    const idToken = await firebaseUser.getIdToken();
                    const userData = await syncUserWithBackend(firebaseUser, idToken);
                    setUser(userData);
                } catch (err) {
                    console.error('Error syncing user:', err);
                    setError(err.message);
                }
            } else {
                setUser(null);
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sync Firebase user with PostgreSQL backend
    const syncUserWithBackend = async (firebaseUser, idToken) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/firebase-sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    firebase_uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || '',
                    email_verified: firebaseUser.emailVerified,
                    photo_url: firebaseUser.photoURL
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.user;
            } else {
                // If backend sync fails, return basic Firebase user info
                return {
                    firebase_uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || '',
                    email_verified: firebaseUser.emailVerified,
                    photo_url: firebaseUser.photoURL,
                    user_type: 'buyer' // Default
                };
            }
        } catch (err) {
            console.error('Backend sync error:', err);
            // Return Firebase user info if backend is unavailable
            return {
                firebase_uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || '',
                email_verified: firebaseUser.emailVerified,
                photo_url: firebaseUser.photoURL,
                user_type: 'buyer'
            };
        }
    };

    // Register new user (buyers/renters only - owners go through different flow)
    const register = async (name, email, password, userType = 'buyer') => {
        setError(null);
        try {
            // Create Firebase user
            const result = await signUpWithEmail(email, password);
            
            // Update display name
            await updateUserProfile(result.user, { displayName: name });
            
            // Send verification email
            await sendVerificationEmail(result.user);
            
            // Sync with backend
            const idToken = await result.user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/auth/firebase-register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    firebase_uid: result.user.uid,
                    name,
                    email,
                    user_type: userType
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            setUser(data.user);
            
            return { 
                user: data.user, 
                emailVerificationSent: true,
                message: 'Account created! Please check your email to verify your account.'
            };
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Register owner/broker (from List Property flow)
    const registerOwner = async (name, email, password, phone = null) => {
        setError(null);
        try {
            // Create Firebase user
            const result = await signUpWithEmail(email, password);
            
            // Update display name
            await updateUserProfile(result.user, { displayName: name });
            
            // Send verification email
            await sendVerificationEmail(result.user);
            
            // Sync with backend as owner
            const idToken = await result.user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/auth/firebase-register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    firebase_uid: result.user.uid,
                    name,
                    email,
                    phone,
                    user_type: 'owner'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            setUser(data.user);
            
            return { 
                user: data.user, 
                emailVerificationSent: true,
                message: 'Owner account created! Please verify your email to start listing properties.'
            };
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Login with email/password
    const login = async (email, password) => {
        setError(null);
        try {
            const result = await signInWithEmail(email, password);
            const idToken = await result.user.getIdToken();
            const userData = await syncUserWithBackend(result.user, idToken);
            setUser(userData);
            return { user: userData };
        } catch (err) {
            let message = 'Login failed';
            if (err.code === 'auth/user-not-found') {
                message = 'No account found with this email';
            } else if (err.code === 'auth/wrong-password') {
                message = 'Incorrect password';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Invalid email address';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many failed attempts. Please try again later.';
            }
            setError(message);
            throw new Error(message);
        }
    };

    // Login with Google
    const loginWithGoogle = async () => {
        setError(null);
        try {
            const result = await signInWithGoogle();
            const idToken = await result.user.getIdToken();
            const userData = await syncUserWithBackend(result.user, idToken);
            setUser(userData);
            return { user: userData };
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await logOut();
            setUser(null);
            setFirebaseUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Send password reset email
    const resetPassword = async (email) => {
        setError(null);
        try {
            await sendPasswordReset(email);
            return { message: 'Password reset email sent. Check your inbox.' };
        } catch (err) {
            let message = 'Failed to send reset email';
            if (err.code === 'auth/user-not-found') {
                message = 'No account found with this email';
            }
            setError(message);
            throw new Error(message);
        }
    };

    // Resend verification email
    const resendVerificationEmail = async () => {
        if (firebaseUser && !firebaseUser.emailVerified) {
            try {
                await sendVerificationEmail(firebaseUser);
                return { message: 'Verification email sent!' };
            } catch (err) {
                throw new Error('Failed to send verification email. Please try again later.');
            }
        }
        throw new Error('No user or email already verified');
    };

    // Check if email is verified
    const checkEmailVerified = async () => {
        if (firebaseUser) {
            await firebaseUser.reload();
            const isVerified = firebaseUser.emailVerified;
            
            // Update backend if now verified
            if (isVerified && user && !user.email_verified) {
                try {
                    const idToken = await firebaseUser.getIdToken();
                    await fetch(`${API_BASE_URL}/auth/verify-email-status`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${idToken}`
                        },
                        body: JSON.stringify({ email_verified: true })
                    });
                    setUser({ ...user, email_verified: true });
                } catch (err) {
                    console.error('Failed to update verification status:', err);
                }
            }
            
            return isVerified;
        }
        return false;
    };

    // Upgrade user to owner
    const upgradeToOwner = async () => {
        if (!user) throw new Error('Not authenticated');
        
        try {
            const idToken = await firebaseUser.getIdToken();
            const response = await fetch(`${API_BASE_URL}/users/upgrade-to-owner`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upgrade failed');
            }

            const data = await response.json();
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Get fresh ID token for API calls
    const getIdToken = async () => {
        if (firebaseUser) {
            return await firebaseUser.getIdToken();
        }
        return null;
    };

    // Helper functions
    const isOwner = () => user?.user_type === 'owner' || user?.user_type === 'broker';
    const isEmailVerified = () => firebaseUser?.emailVerified || user?.email_verified;
    const isAuthenticated = !!user && !!firebaseUser;

    const value = {
        user,
        firebaseUser,
        loading,
        error,
        isAuthenticated,
        isOwner,
        isEmailVerified,
        
        // Auth methods
        login,
        loginWithGoogle,
        logout,
        register,
        registerOwner,
        resetPassword,
        resendVerificationEmail,
        checkEmailVerified,
        upgradeToOwner,
        getIdToken,
        
        // Clear error
        clearError: () => setError(null)
    };

    return (
        <FirebaseAuthContext.Provider value={value}>
            {children}
        </FirebaseAuthContext.Provider>
    );
}

export function useFirebaseAuth() {
    const context = useContext(FirebaseAuthContext);
    if (!context) {
        throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
    }
    return context;
}

export default FirebaseAuthContext;
