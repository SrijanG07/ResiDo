import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import PropertyMap from '../components/PropertyMap';
import AdvancedFilters from '../components/AdvancedFilters';
import './BrowseProperties.css';

const CITIES = ['Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'];

function BrowseProperties({ onViewProperty }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: '',
        locality: '',
        min_price: '',
        max_price: '',
        property_type: '',
        listing_type: '',
        bedrooms: '',
        furnished: '',
        // Lifestyle filters
        pet_friendly: '',
        vegetarian_only: '',
        gender_preference: '',
        bachelor_friendly: '',
        // Availability
        min_lease_months: '',
        max_lease_months: '',
        immediate_available: '',
        // Budget extras
        max_deposit_months: '',
        maintenance_included: '',
        // Location
        near_metro: '',
        near_college: '',
        // Amenities
        amenities: ''
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async (customFilters = filters) => {
        setLoading(true);
        try {
            // Remove empty filter values
            const cleanFilters = {};
            Object.entries(customFilters).forEach(([key, value]) => {
                if (value && value !== '') {
                    cleanFilters[key] = value;
                }
            });
            const data = await propertyService.getProperties(cleanFilters);
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
        // On mobile, close filter panel after applying
        if (window.innerWidth < 1024) {
            setShowFilters(false);
        }
    };

    const clearFilters = () => {
        const emptyFilters = {
            city: '', locality: '', min_price: '', max_price: '', property_type: '',
            listing_type: '', bedrooms: '', furnished: '', pet_friendly: '',
            vegetarian_only: '', gender_preference: '', bachelor_friendly: '',
            min_lease_months: '', max_lease_months: '', immediate_available: '',
            max_deposit_months: '', maintenance_included: '', near_metro: '',
            near_college: '', amenities: ''
        };
        setFilters(emptyFilters);
        fetchProperties(emptyFilters);
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString()}`;
    };

    const getMapCenter = () => {
        const validProperties = properties.filter(p => p.latitude && p.longitude);
        if (validProperties.length === 0) return [20.5937, 78.9629];
        const avgLat = validProperties.reduce((sum, p) => sum + parseFloat(p.latitude), 0) / validProperties.length;
        const avgLng = validProperties.reduce((sum, p) => sum + parseFloat(p.longitude), 0) / validProperties.length;
        return [avgLat, avgLng];
    };

    const getActiveFilterCount = () => {
        return Object.values(filters).filter(v => v && v !== '').length;
    };

    return (
        <div className="browse-properties">
            {/* Header */}
            <div className="browse-header">
                <div className="header-content">
                    <h1>Browse Properties</h1>
                    <p>Find your perfect property • {properties.length} results</p>
                </div>

                <div className="header-actions">
                    {/* Mobile Filter Toggle */}
                    <button
                        className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        🔍 Filters
                        {getActiveFilterCount() > 0 && (
                            <span className="filter-badge">{getActiveFilterCount()}</span>
                        )}
                    </button>

                    {/* View Toggle */}
                    <div className="view-toggle">
                        <button
                            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <span>📋</span> List
                        </button>
                        <button
                            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                            onClick={() => setViewMode('map')}
                        >
                            <span>🗺️</span> Map
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="browse-content">
                {/* Filters Sidebar */}
                <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                    <AdvancedFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={applyFilters}
                        onClear={clearFilters}
                    />
                </aside>

                {/* Results Area */}
                <main className="results-area">
                    {loading ? (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                            <p>Loading properties...</p>
                        </div>
                    ) : (
                        <>
                            {/* Results Info */}
                            <div className="results-info">
                                <span>Showing {properties.length} properties</span>
                                {viewMode === 'map' && (
                                    <span className="map-hint">• Click markers to view details</span>
                                )}
                            </div>

                            {/* Map View */}
                            {viewMode === 'map' && (
                                <div className="map-view-container">
                                    <PropertyMap
                                        properties={properties}
                                        center={getMapCenter()}
                                        zoom={10}
                                        onPropertyClick={onViewProperty}
                                        showAmenities={false}
                                    />
                                </div>
                            )}

                            {/* List View */}
                            {viewMode === 'list' && (
                                <div className="properties-grid">
                                    {properties.map(property => (
                                        <div key={property.id} className="property-card">
                                            <div className="property-image">
                                                <img
                                                    src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'}
                                                    alt={property.title}
                                                />
                                                <span className="property-badge">
                                                    {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                                                </span>
                                                {property.latitude && property.longitude && (
                                                    <span className="location-badge" title="Location on map">📍</span>
                                                )}
                                            </div>

                                            <div className="property-info">
                                                <div className="property-price">
                                                    {formatPrice(property.price)}
                                                    {property.listing_type === 'rent' && <small>/month</small>}
                                                </div>
                                                <h3 className="property-title">{property.title}</h3>
                                                <p className="property-location">📍 {property.locality}, {property.city}</p>

                                                <div className="property-meta">
                                                    {property.bedrooms && <span>🛏️ {property.bedrooms} Bed</span>}
                                                    {property.bathrooms && <span>🚿 {property.bathrooms} Bath</span>}
                                                    {property.size && <span>📏 {property.size} sqft</span>}
                                                </div>

                                                {/* Lifestyle Badges */}
                                                <div className="lifestyle-badges">
                                                    {property.pet_friendly && (
                                                        <span className="lifestyle-badge pet">🐾 Pet Friendly</span>
                                                    )}
                                                    {property.vegetarian_only && (
                                                        <span className="lifestyle-badge veg">🥦 Veg Only</span>
                                                    )}
                                                    {property.near_metro && (
                                                        <span className="lifestyle-badge metro">🚇 Near Metro</span>
                                                    )}
                                                    {property.bachelor_friendly && property.property_type !== 'pg' && (
                                                        <span className="lifestyle-badge bachelor">👨‍💼 Bachelor OK</span>
                                                    )}
                                                    {property.gender_preference && property.gender_preference !== 'any' && (
                                                        <span className="lifestyle-badge gender">
                                                            {property.gender_preference === 'male' ? '♂️ Male Only' : '♀️ Female Only'}
                                                        </span>
                                                    )}
                                                </div>

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
                            )}

                            {properties.length === 0 && (
                                <div className="no-results">
                                    <h3>🏠 No properties found</h3>
                                    <p>Try adjusting your filters to see more results</p>
                                    <button className="btn btn-primary" onClick={clearFilters}>
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Mobile Filter Overlay */}
            {showFilters && (
                <div className="filter-overlay" onClick={() => setShowFilters(false)}></div>
            )}
        </div>
    );
}

export default BrowseProperties;
