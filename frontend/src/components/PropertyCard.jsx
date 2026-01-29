import React, { useState, useEffect } from 'react';
import './PropertyCard.css';

function PropertyCard({ property, onViewDetails }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkWishlistStatus();
    }, [property.id]);

    const checkWishlistStatus = async () => {
        const token = localStorage.getItem('roomgi_token');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:5000/api/wishlist/check/${property.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIsWishlisted(data.isWishlisted);
            }
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const toggleWishlist = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('roomgi_token');
        if (!token) {
            alert('Please login to save properties');
            return;
        }

        setIsLoading(true);
        try {
            const method = isWishlisted ? 'DELETE' : 'POST';
            const response = await fetch(`http://localhost:5000/api/wishlist/${property.id}`, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setIsWishlisted(!isWishlisted);
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (typeof price === 'string') return price;
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price?.toLocaleString() || 0}`;
    };

    const getImageUrl = () => {
        if (property.image) return property.image;
        if (property.images && property.images.length > 0) {
            return property.images[0].image_url || property.images[0].url;
        }
        return 'https://via.placeholder.com/400x300?text=No+Image';
    };

    return (
        <div className="property-card" onClick={() => onViewDetails && onViewDetails(property.id)}>
            <div className="card-image">
                <img src={getImageUrl()} alt={property.title || property.location} />
                
                {/* Wishlist Heart Button */}
                <button 
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                    onClick={toggleWishlist}
                    disabled={isLoading}
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isWishlisted ? '💚' : '🤍'}
                </button>

                {/* Listing Type Badge */}
                <span className="card-badge">{property.type || (property.listing_type === 'rent' ? 'For Rent' : 'For Sale')}</span>
            </div>

            <div className="card-content">
                <div className="card-price">{formatPrice(property.price)}</div>
                <h3 className="card-title">{property.title || `${property.beds} BHK in ${property.location?.split(',')[0]}`}</h3>
                <p className="card-location">📍 {property.location || `${property.locality}, ${property.city}`}</p>
                
                <div className="card-features">
                    {(property.beds || property.bedrooms) && (
                        <span>🛏️ {property.beds || property.bedrooms} Beds</span>
                    )}
                    {(property.baths || property.bathrooms) && (
                        <span>🚿 {property.baths || property.bathrooms} Baths</span>
                    )}
                    {(property.sqft || property.size) && (
                        <span>📏 {property.sqft || property.size} sqft</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;
