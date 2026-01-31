const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserActivityLog = sequelize.define('UserActivityLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Null for anonymous actions
        references: {
            model: 'users',
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'user_activity_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Static method to log activity
UserActivityLog.logActivity = async function(userId, action, details = {}, req = null) {
    try {
        return await this.create({
            user_id: userId,
            action,
            details,
            ip_address: req ? (req.ip || req.connection?.remoteAddress) : null,
            user_agent: req ? req.get('User-Agent') : null
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw - activity logging should not break the main flow
        return null;
    }
};

// Action constants
UserActivityLog.ACTIONS = {
    LOGIN: 'login',
    LOGIN_FAILED: 'login_failed',
    LOGOUT: 'logout',
    REGISTER: 'register',
    PASSWORD_RESET_REQUEST: 'password_reset_request',
    PASSWORD_RESET: 'password_reset',
    PASSWORD_CHANGE: 'password_change',
    EMAIL_VERIFIED: 'email_verified',
    PHONE_VERIFIED: 'phone_verified',
    PROFILE_UPDATE: 'profile_update',
    ACCOUNT_DEACTIVATED: 'account_deactivated',
    ACCOUNT_REACTIVATED: 'account_reactivated',
    PROPERTY_LISTED: 'property_listed',
    PROPERTY_UPDATED: 'property_updated',
    PROPERTY_DELETED: 'property_deleted',
    INQUIRY_SENT: 'inquiry_sent',
    INQUIRY_REPLIED: 'inquiry_replied',
    OWNER_UPGRADE: 'owner_upgrade'
};

module.exports = UserActivityLog;
