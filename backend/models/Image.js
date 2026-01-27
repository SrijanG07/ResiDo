const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'properties',
            key: 'id'
        }
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'images',
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false
});

module.exports = Image;
