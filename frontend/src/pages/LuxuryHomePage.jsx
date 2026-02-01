import React, { useState, useEffect } from 'react';
import LuxuryHero from '../components/LuxuryHero';
import LuxuryAbout from '../components/LuxuryAbout';
import LuxuryProjects from '../components/LuxuryProjects';
import Luxury3DShowcase from '../components/Luxury3DShowcase';
import LuxuryAmenities from '../components/LuxuryAmenities';
import LuxuryInvestment from '../components/LuxuryInvestment';
import LuxuryLifestyle from '../components/LuxuryLifestyle';
import LuxuryFooter from '../components/LuxuryFooter';
import '../styles/luxury-theme.css';
import './LuxuryHomePage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function LuxuryHomePage({ onNavigate, onViewProperty }) {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch featured properties from backend
    useEffect(() => {
        fetch(`${API_BASE_URL}/properties?limit=6`)
            .then(res => res.json())
            .then(data => {
                // Transform backend data to match component format
                const transformed = data.map(property => ({
                    id: property.id,
                    title: property.title,
                    description: property.description?.substring(0, 120) + '...',
                    image: property.images?.[0]?.image_url || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop`,
                    price: `₹${(property.price / 100000).toFixed(0)} Lakh`,
                    location: `${property.locality}, ${property.city}`,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    area: property.area_sqft
                }));
                setFeaturedProperties(transformed);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching properties:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="luxury-homepage">
            {/* Hero Section with Pinned Scroll */}
            <LuxuryHero onNavigate={onNavigate} />

            {/* About Section with Stats */}
            <LuxuryAbout onNavigate={onNavigate} />

            {/* Projects Carousel */}
            <LuxuryProjects 
                properties={featuredProperties}
                onViewProperty={onViewProperty}
                onNavigate={onNavigate}
            />

            {/* 3D House Showcase */}
            <Luxury3DShowcase />

            {/* Amenities Section */}
            <LuxuryAmenities onNavigate={onNavigate} />

            {/* Investment Section */}
            <LuxuryInvestment onNavigate={onNavigate} />

            {/* Lifestyle Section */}
            <LuxuryLifestyle onNavigate={onNavigate} />

            {/* CTA Section */}
            <section className="luxury-cta">
                <div className="luxury-cta__container">
                    <div className="luxury-cta__content">
                        <h2 className="luxury-cta__title">
                            Ready to Find Your
                            <br />
                            <span className="text-italic">Dream Home?</span>
                        </h2>
                        <p className="luxury-cta__description">
                            Join thousands of happy homeowners who found their perfect property with ResiDo.
                        </p>
                        <div className="luxury-cta__buttons">
                            <button className="btn-luxury" onClick={() => onNavigate('browse')}>
                                <span>Explore Properties</span>
                            </button>
                            <button className="btn-luxury-gold" onClick={() => onNavigate('owner-landing')}>
                                <span>List Your Property</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <LuxuryFooter onNavigate={onNavigate} />
        </div>
    );
}

export default LuxuryHomePage;
