/**
 * Firebase Configuration for ResiDo
 * 
 * To set up Firebase:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings > General
 * 4. Under "Your apps", click the web icon (</>)
 * 5. Register your app and copy the config object
 * 6. Replace the placeholder values below with your config
 * 
 * Or set these as environment variables in your .env file:
 * VITE_FIREBASE_API_KEY=your-api-key
 * VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
 * VITE_FIREBASE_PROJECT_ID=your-project-id
 * VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
 * VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
 * VITE_FIREBASE_APP_ID=your-app-id
 */

import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut,
    onAuthStateChanged,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Auth helper functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email, password) => 
    createUserWithEmailAndPassword(auth, email, password);

export const sendPasswordReset = (email) => 
    sendPasswordResetEmail(auth, email);

export const sendVerificationEmail = (user) => 
    sendEmailVerification(user);

export const logOut = () => signOut(auth);

export const updateUserProfile = (user, data) => 
    updateProfile(user, data);

// Phone authentication helpers
export const setupRecaptcha = (containerId) => {
    return new RecaptchaVerifier(auth, containerId, {
        size: 'normal',
        callback: () => {
            // reCAPTCHA solved
        },
        'expired-callback': () => {
            // Response expired
        }
    });
};

export const signInWithPhone = (phoneNumber, appVerifier) => 
    signInWithPhoneNumber(auth, phoneNumber, appVerifier);

// Auth state observer
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export default app;
