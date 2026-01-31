const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserSession = sequelize.define('UserSession', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    session_token: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true
    },
    firebase_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    last_used: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    ip_address: {
        type: DataTypes.STRING(45), // IPv6 compatible
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    device_info: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'user_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Static method to cleanup expired sessions
UserSession.cleanupExpired = async function() {
    return await this.destroy({
        where: {
            expires_at: {
                [require('sequelize').Op.lt]: new Date()
            }
        }
    });
};

// Static method to invalidate all sessions for a user
UserSession.invalidateAllForUser = async function(userId) {
    return await this.update(
        { is_active: false },
        { where: { user_id: userId } }
    );
};

module.exports = UserSession;
