import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LuxuryInvestment.css';

gsap.registerPlugin(ScrollTrigger);

function LuxuryInvestment({ onNavigate }) {
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
            gsap.utils.toArray('.luxury-investment__reveal').forEach((el, i) => {
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
        <section className="luxury-investment" ref={sectionRef}>
            <div className="luxury-investment__container">
                {/* Left Image */}
                <div className="luxury-investment__image-wrapper">
                    <div className="luxury-investment__image-container" ref={imageRef}>
                        <img 
                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&h=1200&fit=crop&q=90" 
                            alt="Smart Investment"
                            className="luxury-investment__image"
                            loading="lazy"
                        />
                        <div className="investment-shine"></div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="luxury-investment__content">
                    <span className="luxury-investment__label luxury-investment__reveal">(Smart Investment)</span>
                    
                    <h2 className="luxury-investment__title luxury-investment__reveal">
                        Secure Your
                        <br />
                        <span className="text-italic">Financial Future</span>
                    </h2>
                    
                    <p className="luxury-investment__description luxury-investment__reveal">
                        Real estate remains one of the most stable and rewarding investment options. 
                        Our curated properties offer exceptional value with proven appreciation rates 
                        across India's fastest-growing cities.
                    </p>

                    <div className="luxury-investment__buttons">
                        <button className="btn-luxury luxury-investment__reveal" onClick={() => onNavigate && onNavigate('emi-calculator')}>
                            <span>Investment Guide</span>
                        </button>
                        <button className="btn-luxury-outline luxury-investment__reveal" onClick={() => onNavigate && onNavigate('market-analytics')}>
                            <span>📊 Market Analytics</span>
                        </button>
                    </div>

                    {/* Benefits List */}
                    <div className="luxury-investment__benefits">
                        <div className="investment-benefit luxury-investment__reveal">
                            <div className="benefit-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                            </div>
                            <div className="benefit-content">
                                <h4>Tax Benefits</h4>
                                <p>Save up to 3.5L annually through home loan deductions under Section 80C & 24(b).</p>
                            </div>
                        </div>
                        
                        <div className="investment-benefit luxury-investment__reveal">
                            <div className="benefit-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 3v18h18"/>
                                    <path d="M18 9l-5 5-4-4-5 5"/>
                                </svg>
                            </div>
                            <div className="benefit-content">
                                <h4>Capital Growth</h4>
                                <p>Properties in prime locations have shown 12-18% annual appreciation.</p>
                            </div>
                        </div>
                        
                        <div className="investment-benefit luxury-investment__reveal">
                            <div className="benefit-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                    <path d="M3 9h18M9 21V9"/>
                                </svg>
                            </div>
                            <div className="benefit-content">
                                <h4>Rental Income</h4>
                                <p>Generate passive income with rental yields of 3-5% in metro cities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LuxuryInvestment;
