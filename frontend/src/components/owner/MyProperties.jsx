import React, { useState, useEffect } from 'react';
import './MyProperties.css';

// Mock data - will be replaced with API
const MOCK_PROPERTIES = [
    {
        id: 1,
        title: '3 BHK Apartment in Koramangala',
        price: 8900000,
        city: 'Bangalore',
        locality: 'Koramangala',
        status: 'available',
        views: 2340,
        inquiries: 28,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300'
    },
    {
        id: 2,
        title: '2 BHK Flat in Indiranagar',
        price: 6500000,
        city: 'Bangalore',
        locality: 'Indiranagar',
        status: 'booked',
        views: 1850,
        inquiries: 15,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300'
    },
    {
        id: 3,
        title: '4 BHK Villa in Whitefield',
        price: 15000000,
        city: 'Bangalore',
        locality: 'Whitefield',
        status: 'available',
        views: 890,
        inquiries: 8,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300'
    }
];

function MyProperties({ onAddProperty }) {
    const [properties, setProperties] = useState(MOCK_PROPERTIES);
    const [viewMode, setViewMode] = useState('grid');

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <div className="my-properties">
            {/* Header */}
            <div className="properties-header">
                <div className="header-left">
                    <span className="property-count">{properties.length} Properties</span>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            ▦
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            ☰
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={onAddProperty}>
                        ➕ Add New Property
                    </button>
                </div>
            </div>

            {/* Properties Grid/List */}
            <div className={`properties-${viewMode}`}>
                {properties.map(property => (
                    <div key={property.id} className="property-card">
                        <div className="property-image">
                            <img src={property.image} alt={property.title} />
                            <span className={`status-badge ${property.status}`}>
                                {property.status === 'available' ? 'Available' : 'Booked'}
                            </span>
                        </div>
                        <div className="property-content">
                            <div className="property-price">{formatPrice(property.price)}</div>
                            <h3 className="property-title">{property.title}</h3>
                            <p className="property-location">{property.locality}, {property.city}</p>

                            <div className="property-stats">
                                <span>{property.views} views</span>
                                <span>{property.inquiries} inquiries</span>
                            </div>

                            <div className="property-actions">
                                <button className="btn btn-outline btn-sm">Edit</button>
                                <button className="btn btn-outline btn-sm">View</button>
                                <button className="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {properties.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">⌂</div>
                    <h3>No properties yet</h3>
                    <p>Add your first property to start getting inquiries</p>
                    <button className="btn btn-primary" onClick={onAddProperty}>
                        Add Your First Property
                    </button>
                </div>
            )}
        </div>
    );
}

export default MyProperties;
