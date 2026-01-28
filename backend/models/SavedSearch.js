const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedSearch = sequelize.define('SavedSearch', {
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
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    filters: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    },
    notification_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'saved_searches',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SavedSearch;
