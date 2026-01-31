const jwt = require('jsonwebtoken');
const { User, UserSession } = require('../models');

/**
 * Main authentication middleware
 * Validates JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Optionally verify session is still active
        // This adds a DB call but improves security
        const session = await UserSession.findOne({
            where: { 
                session_token: token,
                is_active: true
            }
        });

        // If sessions are being tracked and this one is invalid
        if (!session && process.env.REQUIRE_SESSION_VALIDATION === 'true') {
            return res.status(401).json({ error: 'Session expired. Please login again.' });
        }

        // Update session last used
        if (session) {
            session.last_used = new Date();
            await session.save();
        }

        req.user = decoded;
        req.session = session;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please login again.' });
        }
        res.status(400).json({ error: 'Invalid token' });
    }
};

/**
 * Alternative name for authMiddleware
 */
const authenticateToken = authMiddleware;

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        req.user = null;
    }
    
    next();
};

/**
 * Require specific user roles
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.user_type)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

/**
 * Require owner or broker role
 */
const requireOwner = requireRole('owner', 'broker');

/**
 * Require email verification
 */
const requireVerified = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user || !user.is_email_verified) {
        return res.status(403).json({ 
            error: 'Email verification required',
            code: 'EMAIL_NOT_VERIFIED'
        });
    }

    next();
};

/**
 * Check if account is active
 */
const requireActiveAccount = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user || user.account_status !== 'active') {
        return res.status(403).json({ 
            error: `Account is ${user?.account_status || 'not found'}`,
            code: 'ACCOUNT_NOT_ACTIVE'
        });
    }

    next();
};

module.exports = { 
    authMiddleware, 
    authenticateToken,
    optionalAuth,
    requireRole,
    requireOwner,
    requireVerified,
    requireActiveAccount
};
