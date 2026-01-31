const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userControllerEnhanced');
const firebaseAuthController = require('../controllers/firebaseAuthController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// ============================================
// VALIDATION RULES (Simplified)
// ============================================

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('user_type')
        .optional()
        .isIn(['buyer', 'renter', 'owner', 'broker']).withMessage('Invalid user type'),
    body('phone')
        .optional()
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
        .notEmpty().withMessage('Name is required'),
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
    registerValidation,
    validate,
    userController.register
);

// Login
router.post('/login',
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
    userController.refreshToken
);

// ============================================
// FIREBASE AUTH ROUTES
// ============================================

// Sync Firebase user with PostgreSQL
router.post('/firebase-sync',
    firebaseAuthController.syncFirebaseUser
);

// Register new user via Firebase
router.post('/firebase-register',
    firebaseRegisterValidation,
    validate,
    firebaseAuthController.registerWithFirebase
);

// Update email verification status
router.post('/verify-email-status',
    authenticateToken,
    firebaseAuthController.updateEmailVerificationStatus
);

// ============================================
// PASSWORD MANAGEMENT
// ============================================

// Request password reset (legacy - for non-Firebase users)
router.post('/forgot-password',
    body('email').isEmail().withMessage('Valid email required'),
    validate,
    userController.forgotPassword
);

// Reset password with token (legacy)
router.post('/reset-password',
    body('token').notEmpty().withMessage('Reset token required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
    userController.resetPassword
);

// Change password (authenticated)
router.post('/change-password',
    authenticateToken,
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
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
