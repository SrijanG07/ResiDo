const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userControllerEnhanced');
const firebaseAuthController = require('../controllers/firebaseAuthController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// ============================================
// RATE LIMITERS
// ============================================

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Less strict limiter for general auth operations
const generalAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Password reset limiter (very strict)
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { error: 'Too many password reset attempts. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ============================================
// VALIDATION RULES
// ============================================

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('user_type')
        .optional()
        .isIn(['buyer', 'renter', 'owner', 'broker']).withMessage('Invalid user type'),
    body('phone')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

const firebaseRegisterValidation = [
    body('firebase_uid')
        .notEmpty().withMessage('Firebase UID is required'),
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('user_type')
        .optional()
        .isIn(['buyer', 'renter', 'owner', 'broker']).withMessage('Invalid user type')
];

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed',
            details: errors.array().map(e => e.msg)
        });
    }
    next();
};

// ============================================
// LEGACY AUTH ROUTES (Email/Password)
// ============================================

// Register new user
router.post('/register', 
    authLimiter,
    registerValidation,
    validate,
    userController.register
);

// Login
router.post('/login',
    authLimiter,
    loginValidation,
    validate,
    userController.login
);

// Logout
router.post('/logout',
    authenticateToken,
    userController.logout
);

// Refresh token
router.post('/refresh',
    generalAuthLimiter,
    userController.refreshToken
);

// ============================================
// FIREBASE AUTH ROUTES
// ============================================

// Sync Firebase user with PostgreSQL
router.post('/firebase-sync',
    generalAuthLimiter,
    firebaseAuthController.syncFirebaseUser
);

// Register new user via Firebase
router.post('/firebase-register',
    authLimiter,
    firebaseRegisterValidation,
    validate,
    firebaseAuthController.registerWithFirebase
);

// Update email verification status
router.post('/verify-email-status',
    generalAuthLimiter,
    authenticateToken,
    firebaseAuthController.updateEmailVerificationStatus
);

// ============================================
// PASSWORD MANAGEMENT
// ============================================

// Request password reset (legacy - for non-Firebase users)
router.post('/forgot-password',
    passwordResetLimiter,
    body('email').isEmail().withMessage('Valid email required'),
    validate,
    userController.forgotPassword
);

// Reset password with token (legacy)
router.post('/reset-password',
    passwordResetLimiter,
    body('token').notEmpty().withMessage('Reset token required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validate,
    userController.resetPassword
);

// Change password (authenticated)
router.post('/change-password',
    generalAuthLimiter,
    authenticateToken,
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
    validate,
    userController.changePassword
);

// ============================================
// VERIFICATION ROUTES
// ============================================

// Verify email token (legacy)
router.get('/verify-email/:token',
    userController.verifyEmail
);

// Resend verification email (legacy)
router.post('/resend-verification',
    generalAuthLimiter,
    authenticateToken,
    userController.resendVerification
);

// ============================================
// USER TYPE MANAGEMENT
// ============================================

// Upgrade buyer to owner
router.post('/upgrade-to-owner',
    authenticateToken,
    userController.upgradeToOwner
);

// ============================================
// SESSION MANAGEMENT
// ============================================

// Get active sessions
router.get('/sessions',
    authenticateToken,
    userController.getActiveSessions
);

// Invalidate a session
router.delete('/sessions/:sessionId',
    authenticateToken,
    userController.invalidateSession
);

// Invalidate all sessions (logout everywhere)
router.post('/logout-all',
    authenticateToken,
    userController.logoutAll
);

module.exports = router;
