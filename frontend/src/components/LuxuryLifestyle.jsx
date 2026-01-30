import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LuxuryLifestyle.css';

gsap.registerPlugin(ScrollTrigger);

function LuxuryLifestyle() {
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
            gsap.utils.toArray('.luxury-lifestyle__reveal').forEach((el, i) => {
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
        <section className="luxury-lifestyle" ref={sectionRef}>
            <div className="luxury-lifestyle__container">
                {/* Left Content */}
                <div className="luxury-lifestyle__content">
                    <span className="luxury-lifestyle__label luxury-lifestyle__reveal">(Premium Living)</span>
                    
                    <h2 className="luxury-lifestyle__title luxury-lifestyle__reveal">
                        Experience The
                        <br />
                        <span className="text-italic">Art of Living</span>
                    </h2>
                    
                    <p className="luxury-lifestyle__description luxury-lifestyle__reveal">
                        We don't just find homes — we curate lifestyles. Every property in our 
                        portfolio is strategically positioned in India's most coveted neighborhoods, 
                        where world-class amenities meet unparalleled convenience.
                    </p>

                    <button className="btn-luxury luxury-lifestyle__reveal">
                        <span>Explore Neighborhoods</span>
                    </button>

                    {/* Features List */}
                    <div className="luxury-lifestyle__features">
                        <div className="lifestyle-feature luxury-lifestyle__reveal">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <div className="feature-content">
                                <h4>Prime Locations</h4>
                                <p>Elite addresses in thriving neighborhoods with seamless metro connectivity and proximity to business districts.</p>
                            </div>
                        </div>
                        
                        <div className="lifestyle-feature luxury-lifestyle__reveal">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>
                            <div className="feature-content">
                                <h4>24/7 Security</h4>
                                <p>Multi-tier surveillance with biometric access, trained personnel, and smart monitoring for complete peace of mind.</p>
                            </div>
                        </div>
                        
                        <div className="lifestyle-feature luxury-lifestyle__reveal">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                            </div>
                            <div className="feature-content">
                                <h4>Smart Homes</h4>
                                <p>Future-ready residences with integrated automation, voice controls, and intelligent energy management systems.</p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="luxury-lifestyle__trust luxury-lifestyle__reveal">
                        <div className="trust-item">
                            <span className="trust-value">4.9/5</span>
                            <span className="trust-label">Customer Rating</span>
                        </div>
                        <div className="trust-divider"></div>
                        <div className="trust-item">
                            <span className="trust-value">25,000+</span>
                            <span className="trust-label">Happy Families</span>
                        </div>
                        <div className="trust-divider"></div>
                        <div className="trust-item">
                            <span className="trust-value">98%</span>
                            <span className="trust-label">Satisfaction Rate</span>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="luxury-lifestyle__image-wrapper">
                    {/* Decorative elements */}
                    <div className="lifestyle-decor">
                        <div className="decor-frame"></div>
                        <div className="decor-corner corner-tr"></div>
                        <div className="decor-corner corner-bl"></div>
                        <div className="decor-badge">
                            <span>Award</span>
                            <strong>2025</strong>
                        </div>
                    </div>
                    
                    <div className="luxury-lifestyle__image-container" ref={imageRef}>
                        <img 
                            src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1000&h=1200&fit=crop&q=90" 
                            alt="Premium Lifestyle Living"
                            className="luxury-lifestyle__image"
                            loading="lazy"
                        />
                        <div className="lifestyle-shine"></div>
                    </div>
                    
                    <div className="luxury-lifestyle__image-overlay">
                        <div className="overlay-content">
                            <span className="overlay-number">100+</span>
                            <span className="overlay-label">World-Class Amenities</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LuxuryLifestyle;
