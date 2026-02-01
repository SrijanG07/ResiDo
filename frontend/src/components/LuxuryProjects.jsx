import React, { useRef } from 'react';
import './LuxuryProjects.css';

function LuxuryProjects({ properties = [], onViewProperty, onNavigate }) {
    const sectionRef = useRef(null);

    // Default showcase properties if none provided
    const showcaseProperties = properties.length > 0 ? properties.slice(0, 6) : [
        {
            id: 1,
            title: 'Modern Duplex Residences',
            description: 'Spacious two-story apartments featuring sunlit living spaces, private terraces, and modern amenities.',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
            price: '₹1.5 Cr onwards'
        },
        {
            id: 2,
            title: 'Skyview Penthouse',
            description: 'Stunning top-floor home with panoramic city views, spacious interiors, and modern finishes.',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
            price: '₹3.2 Cr onwards'
        },
        {
            id: 3,
            title: 'Serenity Garden Villas',
            description: 'Private villas surrounded by lush gardens, featuring contemporary design with traditional craftsmanship.',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
            price: '₹2.1 Cr onwards'
        }
    ];

    return (
        <section className="luxury-projects" ref={sectionRef}>
            {/* Section Header */}
            <div className="luxury-projects__header">
                <span className="luxury-projects__label">(Our Projects)</span>
            </div>

            {/* Main Title */}
            <h2 className="luxury-projects__title">Featured Properties</h2>

            {/* Property Grid */}
            <div className="luxury-projects__grid">
                {showcaseProperties.map((property, index) => (
                    <article 
                        key={property.id} 
                        className="luxury-project-card"
                        onClick={() => onViewProperty ? onViewProperty(property.id) : null}
                    >
                        <div className="luxury-project-card__image-wrapper">
                            <img 
                                src={property.image || property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'} 
                                alt={property.title}
                                className="luxury-project-card__image"
                                loading="lazy"
                            />
                            <div className="luxury-project-card__overlay">
                                <h3>{property.title}</h3>
                                <p>{property.price || property.location}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Description & CTA */}
            <div className="luxury-projects__footer">
                <p className="luxury-projects__description">
                    Browse our curated collection of quality properties across India.
                </p>
                <button 
                    className="btn-luxury"
                    onClick={() => onNavigate ? onNavigate('browse') : null}
                >
                    <span>Learn More</span>
                </button>
            </div>
        </section>
    );
}

export default LuxuryProjects;
