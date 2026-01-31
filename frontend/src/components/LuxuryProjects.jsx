import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LuxuryProjects.css';

gsap.registerPlugin(ScrollTrigger);

function LuxuryProjects({ properties = [], onViewProperty, onNavigate }) {
    const sectionRef = useRef(null);
    const carouselRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

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

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Delay to ensure DOM is ready after hero pin
        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                // Horizontal scroll for carousel on desktop
                if (carouselRef.current && window.innerWidth > 768) {
                    const cards = carouselRef.current.querySelectorAll('.luxury-project-card');
                    const totalWidth = carouselRef.current.scrollWidth;
                    const viewportWidth = window.innerWidth;
                    
                    gsap.to(carouselRef.current, {
                        x: () => -(totalWidth - viewportWidth + 100),
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top top',
                            end: () => `+=${totalWidth}`,
                            scrub: 1,
                            pin: true,
                            pinSpacing: true,
                            onUpdate: (self) => {
                                const newIndex = Math.round(self.progress * (cards.length - 1));
                                setActiveIndex(newIndex);
                            }
                        }
                    });
                }

                // Card reveal animations
                gsap.utils.toArray('.luxury-project-card').forEach((card, i) => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                        },
                        y: 60,
                        opacity: 0,
                        duration: 1,
                        delay: i * 0.1,
                        ease: 'power3.out',
                    });
                });

                // Refresh after setup
                ScrollTrigger.refresh();

            }, sectionRef);

            return () => ctx.revert();
        }, 200);

        return () => clearTimeout(timer);
    }, [showcaseProperties.length]);

    return (
        <section className="luxury-projects" ref={sectionRef}>
            {/* Section Header */}
            <div className="luxury-projects__header">
                <span className="luxury-projects__label">(Our Projects)</span>
                <div className="luxury-projects__pagination">
                    {showcaseProperties.map((_, i) => (
                        <span 
                            key={i} 
                            className={`pagination-dot ${i === activeIndex ? 'active' : ''}`}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Title */}
            <h2 className="luxury-projects__title">
                {showcaseProperties[activeIndex]?.title || 'Featured Properties'}
            </h2>

            {/* Carousel */}
            <div className="luxury-projects__carousel" ref={carouselRef}>
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
                    {showcaseProperties[activeIndex]?.description || 'Browse our curated collection of quality properties across India.'}
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
