import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { propertyService } from '../services/api';
import PropertyMap from '../components/PropertyMap';
import StreetViewModal from '../components/StreetViewModal';
import ReviewSection from '../components/ReviewSection';
import TrustBadge from '../components/TrustBadge';
import '../styles/luxury-theme.css';
import './LuxuryPropertyDetail.css';

const amenityIcons = {
    school: { emoji: 'S', label: 'School' },
    hospital: { emoji: 'H', label: 'Hospital' },
    pharmacy: { emoji: 'Rx', label: 'Pharmacy' },
    supermarket: { emoji: 'M', label: 'Supermarket' },
    restaurant: { emoji: 'R', label: 'Restaurant' },
    bank: { emoji: 'B', label: 'Bank' },
    bus_station: { emoji: 'BS', label: 'Bus Stop' },
    subway_entrance: { emoji: 'MT', label: 'Metro' },
};

function LuxuryPropertyDetail({ propertyId, onBack, onNavigate }) {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [nearbyAmenities, setNearbyAmenities] = useState([]);
    const [amenitiesLoading, setAmenitiesLoading] = useState(false);
    const [showAmenities, setShowAmenities] = useState(false);
    const [showStreetView, setShowStreetView] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageSent, setMessageSent] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        fetchProperty();
    }, [propertyId]);

    useEffect(() => {
        if (property?.latitude && property?.longitude) {
            fetchNearbyAmenities();
        }
    }, [property]);

    useEffect(() => {
        if (!loading && contentRef.current && property) {
            gsap.fromTo('.luxury-detail__section', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [loading]);

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
        const radius = 1500;
        const amenityTypes = ['school', 'hospital', 'pharmacy', 'supermarket', 'restaurant', 'bank', 'bus_station', 'subway_entrance'];
        const query = `[out:json][timeout:25];(${amenityTypes.map(type => `node["amenity"="${type}"](around:${radius},${lat},${lng});`).join('')});out body;`;

        try {
            const response = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
            const data = await response.json();
            const amenitiesWithDistance = (data.elements || []).map(amenity => {
                const distance = calculateDistance(lat, lng, amenity.lat, amenity.lon);
                return { ...amenity, distance, type: amenity.tags?.amenity, name: amenity.tags?.name || amenityIcons[amenity.tags?.amenity]?.label || 'Place' };
            }).sort((a, b) => a.distance - b.distance);
            setNearbyAmenities(amenitiesWithDistance);
        } catch (error) {
            console.error('Error fetching nearby amenities:', error);
        } finally {
            setAmenitiesLoading(false);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const formatDistance = (distanceKm) => distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;
    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
        return `₹${price.toLocaleString()}`;
    };

    const sendInquiry = async () => {
        const token = localStorage.getItem('roomgi_token');
        if (!token) { alert('Please login to send a message'); return; }
        if (!messageText.trim()) { alert('Please enter a message'); return; }

        setSendingMessage(true);
        try {
            const response = await fetch('http://localhost:5000/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ property_id: propertyId, message: messageText.trim() })
            });
            if (response.ok) {
                setMessageSent(true);
                setMessageText('');
                setTimeout(() => { setShowMessageModal(false); setMessageSent(false); }, 2000);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Send inquiry error:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSendingMessage(false);
        }
    };

    const nextImage = () => property.images?.length > 0 && setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    const prevImage = () => property.images?.length > 0 && setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    const getDirections = () => property?.latitude && property?.longitude && window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`, '_blank');

    const groupedAmenities = nearbyAmenities.reduce((acc, amenity) => {
        const type = amenity.type || 'other';
        if (!acc[type]) acc[type] = [];
        if (acc[type].length < 3) acc[type].push(amenity);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="luxury-detail luxury-detail--loading">
                <div className="luxury-loading">
                    <div className="luxury-loading__spinner" />
                    <p>Loading property...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="luxury-detail luxury-detail--error">
                <h2>Property not found</h2>
                <button className="btn-luxury" onClick={onBack}><span>Go Back</span></button>
            </div>
        );
    }

    return (
        <div className="luxury-detail">
            {/* Navigation */}
            <nav className="luxury-detail__nav">
                <a href="#" className="luxury-detail__logo" onClick={(e) => { e.preventDefault(); onNavigate?.('home') || onBack(); }}>
                    ROOMGI
                </a>
                <button className="btn-back" onClick={onBack}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Properties
                </button>
            </nav>

            {/* Hero Image Gallery */}
            <div className="luxury-detail__gallery">
                <div className="gallery-main">
                    <img
                        src={property.images?.[currentImageIndex]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'}
                        alt={property.title}
                    />
                    {property.images?.length > 1 && (
                        <>
                            <button className="gallery-nav gallery-nav--prev" onClick={prevImage}>
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button className="gallery-nav gallery-nav--next" onClick={nextImage}>
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                            <div className="gallery-indicator">
                                {property.images.map((_, idx) => (
                                    <span 
                                        key={idx} 
                                        className={idx === currentImageIndex ? 'active' : ''}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                {property.images?.length > 1 && (
                    <div className="gallery-thumbs">
                        {property.images.slice(0, 5).map((img, idx) => (
                            <img
                                key={idx}
                                src={img.image_url}
                                alt={`View ${idx + 1}`}
                                className={idx === currentImageIndex ? 'active' : ''}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="luxury-detail__content" ref={contentRef}>
                {/* Main Info */}
                <div className="luxury-detail__main">
                    <div className="luxury-detail__section luxury-detail__header">
                        <div className="property-badge-row">
                            <span className="property-type-badge">{property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                            <TrustBadge propertyId={propertyId} size="normal" />
                        </div>
                        <h1 className="property-title">{property.title}</h1>
                        <p className="property-location">{property.address}, {property.locality}, {property.city}</p>
                        <div className="property-price">
                            {formatPrice(property.price)}
                            {property.listing_type === 'rent' && <span className="price-suffix">/month</span>}
                        </div>
                    </div>

                    <div className="luxury-detail__section property-stats">
                        {property.bedrooms && (
                            <div className="stat-item">
                                <span className="stat-value">{property.bedrooms}</span>
                                <span className="stat-label">Bedrooms</span>
                            </div>
                        )}
                        {property.bathrooms && (
                            <div className="stat-item">
                                <span className="stat-value">{property.bathrooms}</span>
                                <span className="stat-label">Bathrooms</span>
                            </div>
                        )}
                        {property.size && (
                            <div className="stat-item">
                                <span className="stat-value">{property.size}</span>
                                <span className="stat-label">Sq Ft</span>
                            </div>
                        )}
                        {property.furnished && (
                            <div className="stat-item">
                                <span className="stat-value">{property.furnished.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                                <span className="stat-label">Furnishing</span>
                            </div>
                        )}
                    </div>

                    <div className="luxury-detail__section">
                        <h2>Description</h2>
                        <p className="property-description">{property.description || 'No description available.'}</p>
                    </div>

                    {property.amenities?.length > 0 && (
                        <div className="luxury-detail__section">
                            <h2>Amenities</h2>
                            <div className="amenities-grid">
                                {property.amenities.map((amenity, idx) => (
                                    <div key={idx} className="amenity-chip">
                                        <span className="amenity-check">✓</span>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {property.latitude && property.longitude && (
                        <div className="luxury-detail__section">
                            <div className="section-header">
                                <h2>Location</h2>
                                <div className="section-actions">
                                    <button className="btn-action" onClick={() => setShowStreetView(true)}>
                                        Street View
                                    </button>
                                    <button className="btn-action btn-action--primary" onClick={getDirections}>
                                        Directions
                                    </button>
                                </div>
                            </div>
                            <div className="location-map">
                                <PropertyMap
                                    properties={[property]}
                                    center={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                                    zoom={15}
                                    showAmenities={showAmenities}
                                />
                            </div>
                            {nearbyAmenities.length > 0 && (
                                <div className="nearby-places">
                                    <h3>What's Nearby</h3>
                                    <div className="nearby-grid">
                                        {Object.entries(groupedAmenities).slice(0, 4).map(([type, items]) => (
                                            <div key={type} className="nearby-category">
                                                <span className="category-icon">{amenityIcons[type]?.emoji || '●'}</span>
                                                <span className="category-label">{amenityIcons[type]?.label || type}</span>
                                                <span className="category-distance">{formatDistance(items[0].distance)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="luxury-detail__section">
                        <ReviewSection propertyId={propertyId} />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="luxury-detail__sidebar">
                    <div className="contact-card glass">
                        <h3>Contact {property.owner?.user_type === 'broker' ? 'Broker' : 'Owner'}</h3>
                        <div className="owner-info">
                            <div className="owner-avatar">
                                {property.owner?.name?.charAt(0).toUpperCase() || 'O'}
                            </div>
                            <div>
                                <p className="owner-name">{property.owner?.name || 'Property Owner'}</p>
                                <span className="owner-type">{property.owner?.user_type?.toUpperCase() || 'OWNER'}</span>
                            </div>
                        </div>
                        {property.owner?.phone && (
                            <div className="contact-row">
                                <span>P</span>
                                <span>{property.owner.phone}</span>
                            </div>
                        )}
                        <button className="btn-luxury btn-luxury--full" onClick={() => setShowMessageModal(true)}>
                            <span>Send Inquiry</span>
                        </button>
                        <button className="btn-luxury-outline btn-luxury--full">
                            <span>Schedule Visit</span>
                        </button>
                    </div>
                </aside>
            </div>

            {/* Message Modal */}
            {showMessageModal && (
                <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
                    <div className="luxury-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Send Message</h3>
                            <button className="modal-close" onClick={() => setShowMessageModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-property-preview">
                                <img src={property.images?.[0]?.image_url || ''} alt={property.title} />
                                <div>
                                    <h4>{property.title}</h4>
                                    <p>{formatPrice(property.price)}</p>
                                </div>
                            </div>
                            {messageSent ? (
                                <div className="message-success">
                                    <span>✅</span>
                                    <p>Message sent successfully!</p>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Hi, I'm interested in this property. Is it still available?"
                                        rows={4}
                                    />
                                    <button className="btn-luxury btn-luxury--full" onClick={sendInquiry} disabled={sendingMessage}>
                                        <span>{sendingMessage ? 'Sending...' : 'Send Message'}</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

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

export default LuxuryPropertyDetail;
