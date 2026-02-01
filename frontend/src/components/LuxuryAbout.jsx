import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LuxuryAbout.css';

gsap.registerPlugin(ScrollTrigger);

function LuxuryAbout({ onNavigate }) {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const statsRef = useRef(null);
    const parallaxRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse parallax effect for image
    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
    };

    // Apply parallax transform
    useEffect(() => {
        if (parallaxRef.current) {
            const translateX = mousePosition.x * 15;
            const translateY = mousePosition.y * 15;
            parallaxRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    }, [mousePosition]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Image reveal animation
            gsap.from(imageRef.current, {
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: 1,
                },
                yPercent: 20,
                scale: 0.95,
                opacity: 0.5,
            });

            // Stats counter animation
            const statNumbers = statsRef.current?.querySelectorAll('.stat-number');
            statNumbers?.forEach((stat) => {
                const target = parseInt(stat.dataset.value, 10);
                gsap.fromTo(stat, 
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: 1 },
                        scrollTrigger: {
                            trigger: stat,
                            start: 'top 80%',
                        }
                    }
                );
            });

            // Reveal animations for text elements
            gsap.utils.toArray('.luxury-about__reveal').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="luxury-about" ref={sectionRef}>
            <div className="luxury-about__container">
                {/* Left Column - Text */}
                <div className="luxury-about__left">
                    <span className="luxury-about__label luxury-about__reveal">(About)</span>
                    
                    <h2 className="luxury-about__title luxury-about__reveal">
                        <span className="text-italic">Timeless</span> Design.
                        <br />
                        <span className="text-italic">Wellness</span>-Focused
                        <br />
                        Living.
                    </h2>
                </div>

                {/* Center - Image with Animated Frame */}
                <div 
                    className="luxury-about__center" 
                    ref={imageRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="luxury-about__image-wrapper">
                        {/* Inner parallax container */}
                        <div className="image-parallax-inner" ref={parallaxRef}>
                            <img 
                                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=1000&fit=crop&q=90" 
                                alt="Luxury Interior"
                                className="luxury-about__image"
                            />
                        </div>
                        
                        {/* Overlay gradient */}
                        <div className="image-overlay"></div>
                        
                        {/* Shine effect */}
                        <div className="image-shine"></div>
                    </div>
                </div>

                {/* Right Column - Description */}
                <div className="luxury-about__right">
                    <div className="luxury-about__description luxury-about__reveal">
                        <p>
                            Every element of ResiDo reflects our commitment to helping you find your perfect home. 
                            From cozy apartments to spacious villas, we connect buyers and sellers 
                            with verified properties across India.
                        </p>
                        <p>
                            Whether you're looking for your first home, upgrading to a bigger space, or 
                            investing in property, ResiDo makes it simple and transparent.
                        </p>
                    </div>
                    <button className="btn-luxury luxury-about__reveal" onClick={() => onNavigate && onNavigate('browse')}>
                        <span>Learn More</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="luxury-about__stats" ref={statsRef}>
                <div className="luxury-about__stat luxury-about__reveal">
                    <span className="stat-number" data-value="150">0</span>
                    <span className="stat-unit">k</span>
                    <span className="stat-suffix">sq. ft.</span>
                    <p className="stat-description">of meticulously designed living space.</p>
                </div>

                <div className="luxury-about__stat luxury-about__reveal">
                    <span className="stat-number" data-value="60">0</span>
                    <span className="stat-unit">%</span>
                    <p className="stat-description">green spaces for tranquility & wellness.</p>
                </div>

                <div className="luxury-about__stat luxury-about__reveal">
                    <span className="stat-number" data-value="30">0</span>
                    <p className="stat-description">residences, each tailored for comfort & convenience.</p>
                </div>

                <div className="luxury-about__stat luxury-about__reveal">
                    <span className="stat-number" data-value="24">0</span>
                    <span className="stat-unit">/7</span>
                    <p className="stat-description">concierge services, meeting every need effortlessly.</p>
                </div>
            </div>
        </section>
    );
}

export default LuxuryAbout;
