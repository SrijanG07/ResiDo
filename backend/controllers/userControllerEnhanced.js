const { User, UserSession, UserActivityLog, UserPreferences } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Enhanced User Controller with session management and security features
 */

// Register new user (legacy - email/password)
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, user_type } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password_hash: password,
            phone: phone || null,
            user_type: user_type || 'buyer',
            account_status: 'active'
        });

        // Create default preferences
        await UserPreferences.create({ user_id: user.id });

        // Generate tokens
        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        // Create session
        await UserSession.create({
            user_id: user.id,
            session_token: token,
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
        });

        // Log activity
        await UserActivityLog.logActivity(user.id, UserActivityLog.ACTIONS.REGISTER, {
            method: 'email_password',
            user_type: user.user_type
        }, req);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            refreshToken,
            user: formatUserResponse(user)
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            await UserActivityLog.logActivity(null, UserActivityLog.ACTIONS.LOGIN_FAILED, {
                email,
                reason: 'user_not_found'
            }, req);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check account status
        if (user.account_status !== 'active') {
            return res.status(403).json({ 
                error: `Account is ${user.account_status}. Please contact support.` 
            });
        }

        // Verify password
        const isValidPassword = await user.verifyPassword(password);
        if (!isValidPassword) {
            await UserActivityLog.logActivity(user.id, UserActivityLog.ACTIONS.LOGIN_FAILED, {
                reason: 'invalid_password'
            }, req);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.last_login = new Date();
        await user.save();

        // Generate tokens
        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        // Create session
        await UserSession.create({
            user_id: user.id,
            session_token: token,
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
        });

        // Log activity
        await UserActivityLog.logActivity(user.id, UserActivityLog.ACTIONS.LOGIN, {
            method: 'email_password'
        }, req);

        res.json({
            message: 'Login successful',
            token,
            refreshToken,
            user: formatUserResponse(user)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Invalidate session
            await UserSession.update(
                { is_active: false },
                { where: { session_token: token } }
            );
        }

        await UserActivityLog.logActivity(req.user?.id, UserActivityLog.ACTIONS.LOGOUT, {}, req);

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

// Refresh token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }

        // Find valid session
        const session = await UserSession.findOne({
            where: { 
                refresh_token: refreshToken,
                is_active: true
            },
            include: [{ model: User, as: 'user' }]
        });

        if (!session || new Date() > session.expires_at) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        // Generate new tokens
        const newToken = generateAccessToken(session.user);
        const newRefreshToken = generateRefreshToken();

        // Update session
        session.session_token = newToken;
        session.refresh_token = newRefreshToken;
        session.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        session.last_used = new Date();
        await session.save();

        res.json({
            token: newToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

// Forgot password (stub - needs email service)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        
        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ message: 'If an account exists, a reset email has been sent.' });
        }

        // TODO: Generate reset token and send email
        // For now, just log the activity
        await UserActivityLog.logActivity(user.id, UserActivityLog.ACTIONS.PASSWORD_RESET_REQUEST, {}, req);

        res.json({ message: 'If an account exists, a reset email has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
};

// Reset password (stub)
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // TODO: Validate token and update password
        res.json({ message: 'Password reset functionality coming soon' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValid = await user.verifyPassword(currentPassword);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Update password
        user.password_hash = newPassword;
        await user.save();

        // Invalidate all other sessions
        const currentToken = req.headers.authorization?.split(' ')[1];
        await UserSession.update(
            { is_active: false },
            { 
                where: { 
                    user_id: userId,
                    session_token: { [require('sequelize').Op.ne]: currentToken }
                } 
            }
        );

        await UserActivityLog.logActivity(userId, UserActivityLog.ACTIONS.PASSWORD_CHANGE, {}, req);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// Verify email (stub)
exports.verifyEmail = async (req, res) => {
    res.json({ message: 'Email verification handled by Firebase' });
};

// Resend verification (stub)
exports.resendVerification = async (req, res) => {
    res.json({ message: 'Verification email sent via Firebase' });
};

// Upgrade to owner
exports.upgradeToOwner = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.user_type === 'owner' || user.user_type === 'broker') {
            return res.status(400).json({ error: 'Already an owner/broker' });
        }

        user.user_type = 'owner';
        await user.save();

        await UserActivityLog.logActivity(userId, UserActivityLog.ACTIONS.OWNER_UPGRADE, {
            previous_type: req.user.user_type
        }, req);

        // Generate new token with updated user_type
        const token = generateAccessToken(user);

        res.json({
            message: 'Successfully upgraded to owner',
            user: formatUserResponse(user),
            token
        });
    } catch (error) {
        console.error('Upgrade error:', error);
        res.status(500).json({ error: 'Failed to upgrade account' });
    }
};

// Get active sessions
exports.getActiveSessions = async (req, res) => {
    try {
        const sessions = await UserSession.findAll({
            where: { 
                user_id: req.user.id,
                is_active: true,
                expires_at: { [require('sequelize').Op.gt]: new Date() }
            },
            attributes: ['id', 'created_at', 'last_used', 'ip_address', 'user_agent', 'device_info'],
            order: [['last_used', 'DESC']]
        });

        res.json({ sessions });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to get sessions' });
    }
};

// Invalidate a session
exports.invalidateSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        await UserSession.update(
            { is_active: false },
            { 
                where: { 
                    id: sessionId,
                    user_id: req.user.id 
                } 
            }
        );

        res.json({ message: 'Session invalidated' });
    } catch (error) {
        console.error('Invalidate session error:', error);
        res.status(500).json({ error: 'Failed to invalidate session' });
    }
};

// Logout from all devices
exports.logoutAll = async (req, res) => {
    try {
        await UserSession.invalidateAllForUser(req.user.id);
        
        await UserActivityLog.logActivity(req.user.id, UserActivityLog.ACTIONS.LOGOUT, {
            all_devices: true
        }, req);

        res.json({ message: 'Logged out from all devices' });
    } catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({ error: 'Failed to logout from all devices' });
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateAccessToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            user_type: user.user_type,
            firebase_uid: user.firebase_uid 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

function generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

function formatUserResponse(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        is_email_verified: user.is_email_verified,
        is_phone_verified: user.is_phone_verified,
        profile_pic_url: user.profile_pic_url,
        verification_level: user.verification_level,
        account_status: user.account_status
    };
}
