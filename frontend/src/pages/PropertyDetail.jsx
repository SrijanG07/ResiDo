import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import PropertyMap from '../components/PropertyMap';
import StreetViewModal from '../components/StreetViewModal';
import './PropertyDetail.css';

// Amenity icons configuration for nearby places
const amenityIcons = {
    school: { emoji: '🏫', label: 'School' },
    hospital: { emoji: '🏥', label: 'Hospital' },
    pharmacy: { emoji: '💊', label: 'Pharmacy' },
    supermarket: { emoji: '🛒', label: 'Supermarket' },
    restaurant: { emoji: '🍽️', label: 'Restaurant' },
    bank: { emoji: '🏦', label: 'Bank' },
    bus_station: { emoji: '🚌', label: 'Bus Stop' },
    subway_entrance: { emoji: '🚇', label: 'Metro' },
};

function PropertyDetail({ propertyId, onBack }) {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [nearbyAmenities, setNearbyAmenities] = useState([]);
    const [amenitiesLoading, setAmenitiesLoading] = useState(false);
    const [showAmenities, setShowAmenities] = useState(false);
    const [showStreetView, setShowStreetView] = useState(false);

    useEffect(() => {
        fetchProperty();
    }, [propertyId]);

    // Fetch nearby amenities when property loads
    useEffect(() => {
        if (property?.latitude && property?.longitude) {
            fetchNearbyAmenities();
        }
    }, [property]);

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const data = await propertyService.getPropertyById(propertyId);
            setProperty(data);
        } catch (error) {
            console.error('Error fetching property:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyAmenities = async () => {
        if (!property?.latitude || !property?.longitude) return;

        setAmenitiesLoading(true);
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);
        const radius = 1500; // 1.5km radius

        const amenityTypes = ['school', 'hospital', 'pharmacy', 'supermarket', 'restaurant', 'bank', 'bus_station', 'subway_entrance'];

        const query = `
            [out:json][timeout:25];
            (
                ${amenityTypes.map(type => `
                    node["amenity"="${type}"](around:${radius},${lat},${lng});
                `).join('')}
            );
            out body;
        `;

        try {
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query,
            });
            const data = await response.json();

            // Process and add distance to each amenity
            const amenitiesWithDistance = (data.elements || []).map(amenity => {
                const distance = calculateDistance(lat, lng, amenity.lat, amenity.lon);
                return {
                    ...amenity,
                    distance,
                    type: amenity.tags?.amenity,
                    name: amenity.tags?.name || amenityIcons[amenity.tags?.amenity]?.label || 'Place'
                };
            }).sort((a, b) => a.distance - b.distance);

            setNearbyAmenities(amenitiesWithDistance);
        } catch (error) {
            console.error('Error fetching nearby amenities:', error);
        } finally {
            setAmenitiesLoading(false);
        }
    };

    // Haversine formula to calculate distance between two points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const formatDistance = (distanceKm) => {
        if (distanceKm < 1) {
            return `${Math.round(distanceKm * 1000)} m`;
        }
        return `${distanceKm.toFixed(1)} km`;
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString()}`;
    };

    const nextImage = () => {
        if (property.images && property.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property.images && property.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
        }
    };

    // Get Directions (opens in new tab with Google Maps or OSM)
    const getDirections = () => {
        if (property?.latitude && property?.longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
            window.open(url, '_blank');
        }
    };

    // Group amenities by type for display
    const groupedAmenities = nearbyAmenities.reduce((acc, amenity) => {
        const type = amenity.type || 'other';
        if (!acc[type]) acc[type] = [];
        if (acc[type].length < 3) { // Limit to 3 per type
            acc[type].push(amenity);
        }
        return acc;
    }, {});

    if (loading) {
        return <div className="loading">Loading property details...</div>;
    }

    if (!property) {
        return <div className="error">Property not found</div>;
    }

    return (
        <div className="property-detail">
            {/* Header with Back Button */}
            <div className="detail-header">
                <button className="btn btn-outline" onClick={onBack}>← Back to Browse</button>
            </div>

            {/* Image Gallery */}
            <div className="image-gallery">
                <div className="main-image">
                    {property.images && property.images.length > 0 ? (
                        <>
                            <img
                                src={property.images[currentImageIndex]?.image_url || 'https://via.placeholder.com/1200x600'}
                                alt={property.title}
                            />
                            {property.images.length > 1 && (
                                <>
                                    <button className="gallery-btn prev" onClick={prevImage}>‹</button>
                                    <button className="gallery-btn next" onClick={nextImage}>›</button>
                                    <div className="gallery-indicator">
                                        {currentImageIndex + 1} / {property.images.length}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <img src="https://via.placeholder.com/1200x600" alt="No image available" />
                    )}
                </div>

                {/* Thumbnail Strip */}
                {property.images && property.images.length > 1 && (
                    <div className="thumbnail-strip">
                        {property.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img.image_url}
                                alt={`Thumbnail ${idx + 1}`}
                                className={idx === currentImageIndex ? 'active' : ''}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Property Info Grid */}
            <div className="property-info-grid">
                {/* Main Details */}
                <div className="info-section main-info">
                    <div className="price-section">
                        <span className="price">{formatPrice(property.price)}</span>
                        <span className="listing-type">{property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                    </div>

                    <h1>{property.title}</h1>
                    <p className="location">📍 {property.address}, {property.locality}, {property.city}, {property.state} - {property.postal_code}</p>

                    <div className="quick-stats">
                        {property.bedrooms && (
                            <div className="stat">
                                <span className="stat-icon">🛏️</span>
                                <div>
                                    <div className="stat-value">{property.bedrooms}</div>
                                    <div className="stat-label">Bedrooms</div>
                                </div>
                            </div>
                        )}
                        {property.bathrooms && (
                            <div className="stat">
                                <span className="stat-icon">🚿</span>
                                <div>
                                    <div className="stat-value">{property.bathrooms}</div>
                                    <div className="stat-label">Bathrooms</div>
                                </div>
                            </div>
                        )}
                        {property.size && (
                            <div className="stat">
                                <span className="stat-icon">📏</span>
                                <div>
                                    <div className="stat-value">{property.size}</div>
                                    <div className="stat-label">Sq Ft</div>
                                </div>
                            </div>
                        )}
                        {property.furnished && (
                            <div className="stat">
                                <span className="stat-icon">🪑</span>
                                <div>
                                    <div className="stat-value">{property.furnished.split('-').join(' ')}</div>
                                    <div className="stat-label">Furnishing</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="description-section">
                        <h2>Description</h2>
                        <p>{property.description || 'No description available.'}</p>
                    </div>

                    {property.amenities && property.amenities.length > 0 && (
                        <div className="amenities-section">
                            <h2>Amenities</h2>
                            <div className="amenities-grid">
                                {property.amenities.map((amenity, idx) => (
                                    <div key={idx} className="amenity-item">
                                        <span className="amenity-icon">✓</span>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location & Nearby Section */}
                    {property.latitude && property.longitude && (
                        <div className="location-section">
                            <div className="location-header">
                                <h2>📍 Location & Nearby</h2>
                                <div className="location-actions">
                                    <button
                                        className="btn btn-lg btn-street-view"
                                        onClick={() => setShowStreetView(true)}
                                    >
                                        🛣️ Street View
                                    </button>
                                    <button className="btn btn-lg btn-primary" onClick={getDirections}>
                                        🧭 Get Directions
                                    </button>
                                    <button
                                        className={`btn btn-sm ${showAmenities ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setShowAmenities(!showAmenities)}
                                    >
                                        {showAmenities ? 'Hide' : 'Show'} Nearby Places
                                    </button>
                                </div>
                            </div>

                            {/* Interactive Map */}
                            <div className="location-map-container">
                                <PropertyMap
                                    properties={[property]}
                                    center={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                                    zoom={15}
                                    showAmenities={showAmenities}
                                />
                            </div>

                            {/* Nearby Amenities List */}
                            {amenitiesLoading ? (
                                <div className="amenities-loading">
                                    <span className="loading-spinner"></span>
                                    Loading nearby places...
                                </div>
                            ) : nearbyAmenities.length > 0 && (
                                <div className="nearby-amenities">
                                    <h3>🏪 What's Nearby</h3>
                                    <div className="nearby-grid">
                                        {Object.entries(groupedAmenities).map(([type, items]) => (
                                            <div key={type} className="nearby-category">
                                                <div className="category-header">
                                                    <span className="category-icon">
                                                        {amenityIcons[type]?.emoji || '📍'}
                                                    </span>
                                                    <span className="category-label">
                                                        {amenityIcons[type]?.label || type}
                                                    </span>
                                                </div>
                                                <div className="category-items">
                                                    {items.map((item, idx) => (
                                                        <div key={idx} className="nearby-item">
                                                            <span className="item-name">{item.name}</span>
                                                            <span className="item-distance">{formatDistance(item.distance)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="property-details">
                        <h2>Property Details</h2>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Property Type:</span>
                                <span className="detail-value">{property.property_type?.charAt(0).toUpperCase() + property.property_type?.slice(1)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Status:</span>
                                <span className="detail-value status-badge">{property.status}</span>
                            </div>
                            {property.available_from && (
                                <div className="detail-item">
                                    <span className="detail-label">Available From:</span>
                                    <span className="detail-value">{new Date(property.available_from).toLocaleDateString()}</span>
                                </div>
                            )}
                            {property.latitude && property.longitude && (
                                <div className="detail-item">
                                    <span className="detail-label">Coordinates:</span>
                                    <span className="detail-value">{property.latitude}, {property.longitude}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Owner Contact Card */}
                <div className="info-section owner-card">
                    <h2>Contact {property.owner?.user_type === 'broker' ? 'Broker' : 'Owner'}</h2>

                    <div className="owner-info">
                        <div className="owner-avatar">
                            {property.owner?.name?.charAt(0).toUpperCase() || 'O'}
                        </div>
                        <div>
                            <h3>{property.owner?.name || 'Property Owner'}</h3>
                            <p className="owner-type">{property.owner?.user_type?.toUpperCase() || 'OWNER'}</p>
                        </div>
                    </div>

                    {property.owner?.phone && (
                        <div className="contact-detail">
                            <span className="contact-icon">📞</span>
                            <span>{property.owner.phone}</span>
                        </div>
                    )}

                    {property.owner?.email && (
                        <div className="contact-detail">
                            <span className="contact-icon">✉️</span>
                            <span>{property.owner.email}</span>
                        </div>
                    )}

                    <button className="btn btn-primary btn-block">Send Inquiry</button>
                    <button className="btn btn-outline btn-block">Schedule Visit</button>
                </div>
            </div>

            {/* Street View Modal */}
            {showStreetView && property?.latitude && property?.longitude && (
                <StreetViewModal
                    latitude={parseFloat(property.latitude)}
                    longitude={parseFloat(property.longitude)}
                    propertyTitle={property.title}
                    onClose={() => setShowStreetView(false)}
                />
            )}
        </div>
    );
}

export default PropertyDetail;
