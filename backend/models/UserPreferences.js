const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPreferences = sequelize.define('UserPreferences', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    notification_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notification_sms: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notification_push: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    marketing_emails: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    theme: {
        type: DataTypes.ENUM('light', 'dark', 'system'),
        defaultValue: 'dark'
    },
    language: {
        type: DataTypes.STRING(5),
        defaultValue: 'en'
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'INR'
    }
}, {
    tableName: 'user_preferences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Static method to get or create preferences for a user
UserPreferences.getOrCreate = async function(userId) {
    const [preferences, created] = await this.findOrCreate({
        where: { user_id: userId },
        defaults: { user_id: userId }
    });
    return preferences;
};

module.exports = UserPreferences;
