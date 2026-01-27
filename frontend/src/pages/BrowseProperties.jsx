import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import './BrowseProperties.css';

const CITIES = ['Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'];
const PROPERTY_TYPES = ['flat', 'home', 'villa', 'plot', 'commercial'];

function BrowseProperties({ onViewProperty }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: '',
        locality: '',
        min_price: '',
        max_price: '',
        property_type: '',
        bedrooms: ''
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async (customFilters = filters) => {
        setLoading(true);
        try {
            const data = await propertyService.getProperties(customFilters);
            setProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const applyFilters = () => {
        fetchProperties(filters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            city: '',
            locality: '',
            min_price: '',
            max_price: '',
            property_type: '',
            bedrooms: ''
        };
        setFilters(emptyFilters);
        fetchProperties(emptyFilters);
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <div className="browse-properties">
            {/* Header */}
            <div className="browse-header">
                <h1>Browse Properties</h1>
                <p>Find your dream property across {CITIES.length} cities • {properties.length} properties available</p>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filters-grid">
                    {/* City Filter */}
                    <div className="filter-group">
                        <label>City</label>
                        <select value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)}>
                            <option value="">All Cities</option>
                            {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Locality Filter */}
                    <div className="filter-group">
                        <label>Locality</label>
                        <input
                            type="text"
                            placeholder="e.g., Koramangala"
                            value={filters.locality}
                            onChange={(e) => handleFilterChange('locality', e.target.value)}
                        />
                    </div>

                    {/* Property Type */}
                    <div className="filter-group">
                        <label>Property Type</label>
                        <select value={filters.property_type} onChange={(e) => handleFilterChange('property_type', e.target.value)}>
                            <option value="">All Types</option>
                            {PROPERTY_TYPES.map(type => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Bedrooms */}
                    <div className="filter-group">
                        <label>Bedrooms</label>
                        <select value={filters.bedrooms} onChange={(e) => handleFilterChange('bedrooms', e.target.value)}>
                            <option value="">Any</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4+ BHK</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="filter-group">
                        <label>Min Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.min_price}
                            onChange={(e) => handleFilterChange('min_price', e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Max Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.max_price}
                            onChange={(e) => handleFilterChange('max_price', e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-actions">
                    <button className="btn btn-primary" onClick={applyFilters}>
                        Apply Filters
                    </button>
                    <button className="btn btn-outline" onClick={clearFilters}>
                        Clear All
                    </button>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="loading">Loading properties...</div>
            ) : (
                <>
                    <div className="results-info">
                        Showing {properties.length} properties
                    </div>

                    <div className="properties-grid">
                        {properties.map(property => (
                            <div key={property.id} className="property-card">
                                <div className="property-image">
                                    <img
                                        src={property.images?.[0]?.image_url || 'https://via.placeholder.com/400x300'}
                                        alt={property.title}
                                    />
                                    <span className="property-badge">{property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                                </div>

                                <div className="property-info">
                                    <div className="property-price">
                                        {formatPrice(property.price)}
                                    </div>
                                    <h3 className="property-title">{property.title}</h3>
                                    <p className="property-location">📍 {property.locality}, {property.city}</p>

                                    <div className="property-meta">
                                        {property.bedrooms && <span>🛏️ {property.bedrooms} Bed</span>}
                                        {property.bathrooms && <span>🚿 {property.bathrooms} Bath</span>}
                                        {property.size && <span>📏 {property.size} sq ft</span>}
                                    </div>

                                    {property.amenities && property.amenities.length > 0 && (
                                        <div className="property-amenities">
                                            {property.amenities.slice(0, 3).map((amenity, idx) => (
                                                <span key={idx} className="amenity-tag">{amenity}</span>
                                            ))}
                                            {property.amenities.length > 3 && (
                                                <span className="amenity-tag">+{property.amenities.length - 3} more</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="property-footer">
                                        <span className="owner-type">{property.owner?.user_type || 'Owner'}</span>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => onViewProperty(property.id)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {properties.length === 0 && (
                        <div className="no-results">
                            <h3>No properties found</h3>
                            <p>Try adjusting your filters to see more results</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default BrowseProperties;
