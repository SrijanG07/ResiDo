const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PropertyNews = sequelize.define('PropertyNews', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    source_name: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    source_url: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        unique: true // Prevent duplicate articles
    },
    image_url: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM(
            'Market Trends',
            'Legal & Tax Updates',
            'Buying & Selling Tips',
            'Rental Market',
            'Infrastructure & Development',
            'Home Investment Advice'
        ),
        allowNull: false,
        defaultValue: 'Market Trends'
    },
    keywords: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    city_mentions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    tableName: 'property_news',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['category'] },
        { fields: ['published_at'] },
        { fields: ['created_at'] }
    ]
});

module.exports = PropertyNews;
