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
        type: DataTypes.ENUM('flat', 'home', 'villa', 'plot', 'commercial', 'pg', 'hostel', 'room'),
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
    features: {
        type: DataTypes.JSON, // Store property features with images and descriptions
        defaultValue: []
    },
    available_from: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.ENUM('available', 'sold', 'rented', 'under_negotiation'),
        defaultValue: 'available'
    },
    // ===== LIFESTYLE FILTERS (Indian Market) =====
    pet_friendly: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    vegetarian_only: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    gender_preference: {
        type: DataTypes.ENUM('any', 'male', 'female'),
        defaultValue: 'any'
    },
    bachelor_friendly: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    // ===== AVAILABILITY & LEASE =====
    min_lease_months: {
        type: DataTypes.INTEGER,
        defaultValue: 11
    },
    deposit_months: {
        type: DataTypes.INTEGER,
        defaultValue: 2
    },
    maintenance_included: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // ===== LOCATION ENHANCEMENTS =====
    near_metro: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    near_college: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'properties',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Property;
