import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LuxuryAmenities.css';

gsap.registerPlugin(ScrollTrigger);

function LuxuryAmenities({ onNavigate }) {
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

                    <button className="btn-luxury luxury-amenities__reveal" onClick={() => onNavigate && onNavigate('browse')}>
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
                </div>
            </div>
        </section>
    );
}

export default LuxuryAmenities;
