import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LuxuryAmenities.css';

gsap.registerPlugin(ScrollTrigger);

function LuxuryAmenities() {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Image parallax
            gsap.to(imageRef.current, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });

            // Reveal animations
            gsap.utils.toArray('.luxury-amenities__reveal').forEach((el, i) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    delay: i * 0.1,
                    ease: 'power3.out',
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="luxury-amenities" ref={sectionRef}>
            <div className="luxury-amenities__container">
                {/* Left Content */}
                <div className="luxury-amenities__content">
                    <h2 className="luxury-amenities__title luxury-amenities__reveal">
                        Wellness-Centered
                        <br />
                        <span className="text-italic">Amenities</span>
                    </h2>
                    
                    <p className="luxury-amenities__description luxury-amenities__reveal">
                        From private fitness studios to guided meditation sessions, our amenities are 
                        designed to enhance your well-being and foster a sense of harmony.
                    </p>

                    <button className="btn-luxury luxury-amenities__reveal">
                        <span>Learn More</span>
                    </button>

                    {/* Features List */}
                    <div className="luxury-amenities__features">
                        <div className="luxury-amenity-item luxury-amenities__reveal">
                            <span className="amenity-number">01</span>
                            <div className="amenity-content">
                                <h4>Private Fitness Studios</h4>
                                <p>State-of-the-art equipment with personal training options.</p>
                            </div>
                        </div>
                        
                        <div className="luxury-amenity-item luxury-amenities__reveal">
                            <span className="amenity-number">02</span>
                            <div className="amenity-content">
                                <h4>Spa & Wellness Center</h4>
                                <p>Rejuvenating treatments and therapeutic services.</p>
                            </div>
                        </div>
                        
                        <div className="luxury-amenity-item luxury-amenities__reveal">
                            <span className="amenity-number">03</span>
                            <div className="amenity-content">
                                <h4>Infinity Pool</h4>
                                <p>Temperature-controlled with panoramic city views.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="luxury-amenities__image-wrapper">
                    {/* Decorative elements */}
                    <div className="amenities-decor">
                        <div className="decor-frame"></div>
                        <div className="decor-corner corner-tl"></div>
                        <div className="decor-corner corner-br"></div>
                        <div className="decor-dots">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                    
                    <div className="luxury-amenities__image-container" ref={imageRef}>
                        <img 
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&h=1200&fit=crop&q=90" 
                            alt="Luxury Amenities"
                            className="luxury-amenities__image"
                            loading="lazy"
                        />
                        {/* Shine effect */}
                        <div className="amenities-shine"></div>
                    </div>
                    
                    <div className="luxury-amenities__image-overlay">
                        <div className="overlay-stat">
                            <span className="stat-value">24/7</span>
                            <span className="stat-label">Concierge Service</span>
                        </div>
                        <div className="overlay-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>Premium</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LuxuryAmenities;
