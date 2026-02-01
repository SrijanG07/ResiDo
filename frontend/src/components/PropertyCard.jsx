import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './PropertyCard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function PropertyCard({ property, onViewProperty, compact = false }) {
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Get primary image
    const primaryImage = property.images?.[0]?.image_url ||
        property.image ||
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';

    // Format price
    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(1)}Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(1)}L`;
        }
        return `₹${price.toLocaleString()}`;
    };

    // Check if property is in wishlist
    useEffect(() => {
        if (user) {
            fetch(`${API_BASE_URL}/wishlist/check/${property.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => setIsWishlisted(data.isWishlisted))
                .catch(() => { });
        }
    }, [property.id, user]);

    // Toggle wishlist
    const handleWishlistToggle = async (e) => {
        e.stopPropagation();

        if (!user) {
            alert('Please login to add to wishlist');
            return;
        }

        try {
            const method = isWishlisted ? 'DELETE' : 'POST';
            const response = await fetch(`${API_BASE_URL}/wishlist/${property.id}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setIsWishlisted(!isWishlisted);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        }
    };

    return (
        <div
            className={`property-card ${compact ? 'compact' : ''}`}
            onClick={() => onViewProperty(property.id)}
        >
            <div className="property-card-image">
                <img
                    src={imageError ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop' : primaryImage}
                    alt={property.title || property.locality}
                    onError={() => setImageError(true)}
                />
                <span className={`property-badge ${property.listing_type === 'rent' ? 'rent' : 'sale'}`}>
                    {property.listing_type === 'rent' ? `₹${property.price}/mo` : formatPrice(property.price)}
                </span>
                <button
                    className={`property-save-btn ${isWishlisted ? 'saved' : ''}`}
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isWishlisted ? '♥' : '♡'}
                </button>
            </div>

            <div className="property-card-content">
                <div className="property-price">
                    {property.listing_type === 'rent'
                        ? `₹${property.price.toLocaleString()}/month`
                        : formatPrice(property.price)
                    }
                </div>
                <h3 className="property-title">
                    {property.title || `${property.bedrooms} BHK in ${property.locality}`}
                </h3>
                <p className="property-location">
                    {property.locality}, {property.city}
                </p>

                {/* Lifestyle badges */}
                {(property.pet_friendly || property.vegetarian_only || property.near_metro) && (
                    <div className="lifestyle-badges">
                        {property.pet_friendly && (
                            <span className="lifestyle-badge pet">Pet-friendly</span>
                        )}
                        {property.vegetarian_only && (
                            <span className="lifestyle-badge veg">Veg-only</span>
                        )}
                        {property.near_metro && (
                            <span className="lifestyle-badge metro">Near Metro</span>
                        )}
                    </div>
                )}

                <div className="property-meta">
                    {property.bedrooms && <span>{property.bedrooms} Beds</span>}
                    {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                    {property.size && <span>{property.size} sq ft</span>}
                </div>

                {/* Calculate EMI Button for Sale Properties */}
                {property.listing_type === 'sale' && (
                    <button
                        className="calculate-emi-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewProperty(property.id);
                        }}
                    >
                        <span>Calculate EMI</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default PropertyCard;
