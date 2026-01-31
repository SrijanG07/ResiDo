const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firebase_uid: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: true // Null for legacy users without Firebase
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true // Null for social login users
    },
    phone: {
        type: DataTypes.STRING(15),
        unique: true,
        allowNull: true
    },
    user_type: {
        type: DataTypes.ENUM('buyer', 'renter', 'owner', 'broker'),
        allowNull: false,
        defaultValue: 'buyer'
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    account_status: {
        type: DataTypes.ENUM('active', 'suspended', 'deactivated'),
        defaultValue: 'active'
    },
    profile_pic_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    verification_level: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            // Only hash password if it exists (not for social logins)
            if (user.password_hash && !user.password_hash.startsWith('$2')) {
                user.password_hash = await bcrypt.hash(user.password_hash, 12);
            }
        },
        beforeUpdate: async (user) => {
            // Hash password if changed and not already hashed
            if (user.changed('password_hash') && user.password_hash && !user.password_hash.startsWith('$2')) {
                user.password_hash = await bcrypt.hash(user.password_hash, 12);
            }
        }
    }
});

// Instance method to verify password
User.prototype.verifyPassword = async function (password) {
    if (!this.password_hash) return false;
    return await bcrypt.compare(password, this.password_hash);
};

// Check if user is owner or broker
User.prototype.isOwner = function () {
    return this.user_type === 'owner' || this.user_type === 'broker';
};

// Check if user can list properties
User.prototype.canListProperties = function () {
    return this.isOwner() && this.account_status === 'active';
};

// Get verification level description
User.prototype.getVerificationStatus = function () {
    const levels = {
        0: 'Unverified',
        1: 'Email Verified',
        2: 'Phone Verified',
        3: 'ID Verified',
        4: 'Fully Verified',
        5: 'Premium Verified'
    };
    return levels[this.verification_level] || 'Unknown';
};

module.exports = User;
