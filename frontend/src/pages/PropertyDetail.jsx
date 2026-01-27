import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import './PropertyDetail.css';

function PropertyDetail({ propertyId, onBack }) {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchProperty();
    }, [propertyId]);

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
        </div>
    );
}

export default PropertyDetail;
