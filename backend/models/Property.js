const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    property_type: {
        type: DataTypes.ENUM('flat', 'home', 'villa', 'plot', 'commercial', 'pg', 'hostel'),
        allowNull: false
    },
    listing_type: {
        type: DataTypes.ENUM('sale', 'rent'),
        allowNull: false,
        defaultValue: 'sale'
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    locality: {
        type: DataTypes.STRING(100)
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    postal_code: {
        type: DataTypes.STRING(10)
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8)
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8)
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER // sq ft
    },
    bedrooms: {
        type: DataTypes.INTEGER
    },
    bathrooms: {
        type: DataTypes.INTEGER
    },
    furnished: {
        type: DataTypes.ENUM('unfurnished', 'semi-furnished', 'fully-furnished')
    },
    amenities: {
        type: DataTypes.JSON, // Store as array
        defaultValue: []
    },
    available_from: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.ENUM('available', 'sold', 'rented', 'under_negotiation'),
        defaultValue: 'available'
    }
}, {
    tableName: 'properties',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Property;
