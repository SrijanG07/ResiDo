const { User, UserActivityLog, UserPreferences } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * Firebase Authentication Controller
 * Handles Firebase auth integration with PostgreSQL backend
 */

// Sync Firebase user with PostgreSQL database
exports.syncFirebaseUser = async (req, res) => {
    try {
        const { firebase_uid, email, name, email_verified, photo_url } = req.body;

        if (!firebase_uid || !email) {
            return res.status(400).json({ error: 'Firebase UID and email are required' });
        }

        // Try to find existing user by firebase_uid or email
        let user = await User.findOne({
            where: { firebase_uid }
        });

        if (!user) {
            // Try finding by email (for linking existing accounts)
            user = await User.findOne({
                where: { email }
            });

            if (user) {
                // Link existing account with Firebase
                user.firebase_uid = firebase_uid;
                user.is_email_verified = email_verified || user.is_email_verified;
                if (photo_url && !user.profile_pic_url) {
                    user.profile_pic_url = photo_url;
                }
                user.last_login = new Date();
                await user.save();

                // Log activity
                await UserActivityLog.logActivity(user.id, UserActivityLog.ACTIONS.LOGIN, {
                    method: 'firebase_sync',
                    linked_existing: true
                }, req);
            }
        } else {
            // Update existing Firebase user
            user.is_email_verified = email_verified || user.is_email_verified;
            user.last_login = new Date();
            if (name && !user.name) user.name = name;
            if (photo_url && !user.profile_pic_url) user.profile_pic_url = photo_url;
            await user.save();

            await UserActivityLog.logActivity(user.id, UserActivityLog.ACTIONS.LOGIN, {
                method: 'firebase_sync'
            }, req);
        }

        if (user) {
            // Generate JWT for backend API calls
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    user_type: user.user_type,
                    firebase_uid: user.firebase_uid 
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    user_type: user.user_type,
                    is_email_verified: user.is_email_verified,
                    is_phone_verified: user.is_phone_verified,
                    profile_pic_url: user.profile_pic_url,
                    verification_level: user.verification_level,
                    account_status: user.account_status
                },
                token
            });
        }

        // User not found - they need to register
        return res.status(404).json({ 
            error: 'User not found',
            code: 'USER_NOT_FOUND',
            message: 'Please complete registration'
        });

    } catch (error) {
        console.error('Firebase sync error:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
};

// Register new user via Firebase
exports.registerWithFirebase = async (req, res) => {
    try {
        const { firebase_uid, name, email, phone, user_type } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            // If user exists but doesn't have Firebase UID, link it
            if (!existingUser.firebase_uid) {
                existingUser.firebase_uid = firebase_uid;
                await existingUser.save();
                
                const token = jwt.sign(
                    { 
                        id: existingUser.id, 
                        email: existingUser.email, 
                        user_type: existingUser.user_type,
                        firebase_uid 
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                return res.json({
                    message: 'Account linked with Firebase',
                    user: {
                        id: existingUser.id,
                        name: existingUser.name,
                        email: existingUser.email,
                        user_type: existingUser.user_type,
                        is_email_verified: existingUser.is_email_verified
                    },
                    token
                });
            }
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Check if firebase_uid already used
        const existingFirebaseUser = await User.findOne({
            where: { firebase_uid }
        });

        if (existingFirebaseUser) {
            return res.status(400).json({ error: 'This account is already registered' });
        }

        // Create new user
        const user = await User.create({
            firebase_uid,
            name,
            email,
            phone: phone || null,
            user_type: user_type || 'buyer',
            is_email_verified: false, // Will be updated when Firebase confirms
            account_status: 'active',
            verification_level: 0
        });

        // Create default preferences
        await UserPreferences.create({
            user_id: user.id
        });

        // Log activity
        await UserActivityLog.logActivity(user.id, UserActivityLog.ACTIONS.REGISTER, {
            method: 'firebase',
            user_type: user.user_type
        }, req);

        // Generate token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                user_type: user.user_type,
                firebase_uid 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: user.user_type,
                is_email_verified: user.is_email_verified
            },
            token
        });

    } catch (error) {
        console.error('Firebase registration error:', error);
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
};

// Update email verification status (called after Firebase verifies email)
exports.updateEmailVerificationStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email_verified } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (email_verified && !user.is_email_verified) {
            user.is_email_verified = true;
            
            // Update verification level if at 0
            if (user.verification_level === 0) {
                user.verification_level = 1;
            }
            
            await user.save();

            // Log activity
            await UserActivityLog.logActivity(userId, UserActivityLog.ACTIONS.EMAIL_VERIFIED, {}, req);
        }

        res.json({
            message: 'Verification status updated',
            user: {
                id: user.id,
                email: user.email,
                is_email_verified: user.is_email_verified,
                verification_level: user.verification_level
            }
        });

    } catch (error) {
        console.error('Update verification error:', error);
        res.status(500).json({ error: 'Failed to update verification status' });
    }
};
