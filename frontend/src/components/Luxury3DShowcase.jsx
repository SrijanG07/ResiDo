import React, { useEffect, useRef } from 'react';
import './Luxury3DShowcase.css';

function Luxury3DShowcase() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="showcase-section" ref={sectionRef}>
            {/* Background Elements */}
            <div className="showcase-bg">
                <div className="showcase-grid"></div>
                <div className="showcase-glow"></div>
            </div>

            <div className="showcase-container">
                {/* Left Content - Professional Text */}
                <div className="showcase-content">
                    <div className="showcase-label">
                        <span className="label-line"></span>
                        <span>ARCHITECTURAL EXCELLENCE</span>
                    </div>
                    
                    <h2 className="showcase-title">
                        Where Vision
                        <br />
                        Meets <span className="text-gold">Reality</span>
                    </h2>
                    
                    <p className="showcase-description">
                        Experience the pinnacle of modern architecture. Our curated collection 
                        features homes designed by world-renowned architects, blending 
                        cutting-edge innovation with timeless elegance.
                    </p>

                    <div className="showcase-features">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 21h18M3 7v14M21 7v14M6 11h.01M6 15h.01M6 19h.01M10 11h.01M10 15h.01M10 19h.01M14 11h.01M14 15h.01M14 19h.01M18 11h.01M18 15h.01M18 19h.01M12 3l9 4M12 3L3 7"/>
                                </svg>
                            </div>
                            <div className="feature-text">
                                <span className="feature-number">500+</span>
                                <span className="feature-label">Quality Properties</span>
                            </div>
                        </div>
                        
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    <path d="M9 12l2 2 4-4"/>
                                </svg>
                            </div>
                            <div className="feature-text">
                                <span className="feature-number">100%</span>
                                <span className="feature-label">Verified Listings</span>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                                    <path d="M2 12h20"/>
                                </svg>
                            </div>
                            <div className="feature-text">
                                <span className="feature-number">360°</span>
                                <span className="feature-label">Virtual Tours</span>
                            </div>
                        </div>
                    </div>

                    <div className="showcase-quote">
                        <blockquote>
                            "Architecture is the learned game, correct and magnificent, 
                            of forms assembled in the light."
                        </blockquote>
                        <cite>— Le Corbusier</cite>
                    </div>
                </div>

                {/* Right Side - 3D House Animation */}
                <div className="showcase-3d">
                    <div className="house-container">
                        {/* Animated House Structure */}
                        <div className="house-3d">
                            {/* Main Building */}
                            <div className="house-face front"></div>
                            <div className="house-face back"></div>
                            <div className="house-face left"></div>
                            <div className="house-face right"></div>
                            <div className="house-face top"></div>
                            
                            {/* Roof */}
                            <div className="roof">
                                <div className="roof-face front"></div>
                                <div className="roof-face back"></div>
                                <div className="roof-face left"></div>
                                <div className="roof-face right"></div>
                            </div>
                            
                            {/* Windows */}
                            <div className="window w1"></div>
                            <div className="window w2"></div>
                            <div className="window w3"></div>
                            <div className="window w4"></div>
                            
                            {/* Door */}
                            <div className="door"></div>
                            
                            {/* Chimney */}
                            <div className="chimney"></div>
                        </div>
                        
                        {/* Ground Shadow */}
                        <div className="house-shadow"></div>
                        
                        {/* Floating Elements */}
                        <div className="floating-elements">
                            <div className="float-item f1">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </div>
                            <div className="float-item f2">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </div>
                            <div className="float-item f3">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Ring */}
                    <div className="orbit-ring"></div>
                    <div className="orbit-ring ring-2"></div>
                </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className="showcase-scroll">
                <span>Explore More</span>
                <div className="scroll-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                    </svg>
                </div>
            </div>
        </section>
    );
}

export default Luxury3DShowcase;
