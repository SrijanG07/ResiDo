import React, { useEffect, useRef, useState } from 'react';
import './index.css';

// Scroll animation observer
const useScrollAnimation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);
};

// Floating Mascot Hook
const useFloatingMascot = () => {
    const [position, setPosition] = useState({ y: 100 });
    const targetY = useRef(100);
    const currentY = useRef(100);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const viewportHeight = window.innerHeight;
            targetY.current = viewportHeight * (0.15 + scrollPercent * 0.6);
        };

        const animate = () => {
            currentY.current += (targetY.current - currentY.current) * 0.05;
            setPosition({ y: currentY.current });
            requestAnimationFrame(animate);
        };

        window.addEventListener('scroll', handleScroll);
        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return position;
};

// Sample property data
const PROPERTIES = [
    { id: 1, price: '₹89,00,000', type: 'For Sale', location: 'Koramangala, Bangalore', sqft: '1,450', beds: 3, baths: 2, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop' },
    { id: 2, price: '₹1,25,00,000', type: 'For Sale', location: 'Whitefield, Bangalore', sqft: '1,800', beds: 4, baths: 3, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop' },
    { id: 3, price: '₹72,50,000', type: 'For Sale', location: 'HSR Layout, Bangalore', sqft: '1,200', beds: 2, baths: 2, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop' },
    { id: 4, price: '₹95,00,000', type: 'For Sale', location: 'Indiranagar, Bangalore', sqft: '1,550', beds: 3, baths: 2, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop' },
    { id: 5, price: '₹1,45,00,000', type: 'For Sale', location: 'Jayanagar, Bangalore', sqft: '2,100', beds: 4, baths: 3, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop' },
    { id: 6, price: '₹68,00,000', type: 'For Sale', location: 'Electronic City, Bangalore', sqft: '1,100', beds: 2, baths: 2, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop' },
];

const FEATURED_HOMES = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=400&fit=crop',
];

function App() {
    useScrollAnimation();
    const mascotPosition = useFloatingMascot();

    return (
        <div className="app">
            {/* Floating Mascot */}
            <div className="floating-mascot" style={{ top: `${mascotPosition.y}px` }}>
                <img src="/mascot.png" alt="RoomGi" />
            </div>

            {/* Navigation */}
            <nav className="navbar">
                <a href="/" className="navbar-logo">
                    <img src="/mascot.png" alt="RoomGi" />
                    <span>RoomGi</span>
                </a>
                <ul className="navbar-links">
                    <li><a href="#properties">Properties</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <button className="btn btn-primary">List Property</button>
            </nav>

            {/* Hero Section - Homewide Inspired */}
            <section className="hero-premium">
                <div className="hero-bg-overlay"></div>
                <div className="hero-content-wrapper">
                    <div className="hero-text-side">
                        <h1 className="hero-main-title animate-on-scroll">
                            <span className="hero-title-line">The World</span>
                            <span className="hero-title-line">Of <span className="text-neon">Luxury</span></span>
                        </h1>
                        <p className="hero-description animate-on-scroll animate-delay-100">
                            Unlock the perfect living experience by exploring a diverse selection of premium homes.
                        </p>
                        <div className="hero-buttons animate-on-scroll animate-delay-200">
                            <button className="btn btn-primary">Explore Now</button>
                            <button className="btn btn-outline">Learn More</button>
                        </div>
                    </div>
                    <div className="hero-images-side animate-on-scroll animate-delay-200">
                        <div className="hero-image-grid">
                            {FEATURED_HOMES.map((img, i) => (
                                <div key={i} className="hero-image-card">
                                    <img src={img} alt={`Home ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Discover Homes Section */}
            <section className="section-discover">
                <div className="container">
                    <div className="section-header-center animate-on-scroll">
                        <h2>Discover Homes</h2>
                        <p>Embark on a journey of discovery through our extensive collection of homes, perfectly curated for you.</p>
                    </div>

                    <div className="discover-carousel animate-on-scroll animate-delay-100">
                        <button className="carousel-btn carousel-prev">‹</button>
                        <div className="discover-images">
                            {FEATURED_HOMES.map((img, i) => (
                                <div key={i} className="discover-image-card">
                                    <img src={img} alt={`Featured ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-btn carousel-next">›</button>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="section-trusted">
                <div className="container">
                    <div className="trusted-content animate-on-scroll">
                        <div className="trusted-text">
                            <h3>Trusted By 100+<br />Top Companies</h3>
                            <p>Our expertise and reliability have positioned us as a cornerstone in the industry, fostering strong partnerships.</p>
                            <button className="btn btn-outline btn-sm">Explore Now</button>
                        </div>
                        <div className="trusted-logos">
                            <span className="logo-placeholder">LADSPA</span>
                            <span className="logo-placeholder"># slack</span>
                            <span className="logo-placeholder">LinkedIn</span>
                            <span className="logo-placeholder">+tunein</span>
                            <span className="logo-placeholder">PayPal</span>
                            <span className="logo-placeholder">Walmart</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Properties Section */}
            <section className="section-properties" id="properties">
                <div className="container">
                    <div className="section-header-left animate-on-scroll">
                        <h2>Explore Latest Properties</h2>
                        <div className="section-nav">
                            <button className="nav-arrow">←</button>
                            <button className="nav-arrow">→</button>
                        </div>
                    </div>

                    <div className="property-grid-premium">
                        {PROPERTIES.map((property, i) => (
                            <div key={property.id} className={`property-card-premium animate-on-scroll animate-delay-${i}00`}>
                                <div className="property-image-wrapper">
                                    <img src={property.image} alt={property.location} />
                                    <span className="property-type-badge">{property.type}</span>
                                </div>
                                <div className="property-info">
                                    <div className="property-price-row">
                                        <span className="property-price">{property.price}</span>
                                    </div>
                                    <p className="property-address">{property.location}</p>
                                    <div className="property-meta">
                                        <span>🏠 {property.sqft} sq ft</span>
                                        <span>🛏️ {property.beds} Bed</span>
                                        <span>🚿 {property.baths} Bath</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-xl animate-on-scroll">
                        <button className="btn btn-outline">See More Houses</button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section-stats">
                <div className="stats-bg-image"></div>
                <div className="container">
                    <div className="stats-grid animate-on-scroll">
                        <div className="stat-item">
                            <span className="stat-number">840+</span>
                            <span className="stat-label">Properties for Sale</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">99%</span>
                            <span className="stat-label">Satisfied & Happy Customers</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">204+</span>
                            <span className="stat-label">Experienced Agents Joined</span>
                        </div>
                    </div>
                    <div className="stats-trust animate-on-scroll animate-delay-100">
                        <h3>Trusted By 25K+ People</h3>
                        <button className="btn btn-primary">Explore Now</button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section-contact" id="contact">
                <div className="contact-bg-image"></div>
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-form-wrapper animate-on-scroll">
                            <h2>Let's Connect with us!</h2>
                            <p>We believe in collaboration and value your input throughout the process.</p>

                            <form className="contact-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="John Doe" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="admin@roomgi.com" />
                                </div>
                                <div className="form-group">
                                    <label>Inquiry Subject</label>
                                    <input type="text" placeholder="Looking to buy a home" />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea rows="4" placeholder="Write your message..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-outline">Send A Message</button>
                            </form>
                        </div>

                        <div className="contact-info-wrapper animate-on-scroll animate-delay-200">
                            <h3>Interested in working with us!</h3>
                            <p>We encourage our team to fearlessly challenge conventions and pioneer new paths.</p>

                            <div className="contact-details">
                                <div className="contact-detail">
                                    <span className="contact-label">Working Mail</span>
                                    <span className="contact-value">contact@roomgi.com</span>
                                </div>
                                <div className="contact-detail">
                                    <span className="contact-label">Office Phone</span>
                                    <span className="contact-value">+91 890 930 988</span>
                                </div>
                                <div className="contact-detail">
                                    <span className="contact-label">Office Address</span>
                                    <span className="contact-value">90 Road, Koramangala,<br />Bangalore, India</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Property Gallery Strip */}
            <section className="section-gallery">
                <div className="gallery-strip">
                    {[...PROPERTIES, ...PROPERTIES].slice(0, 8).map((prop, i) => (
                        <div key={i} className="gallery-item">
                            <img src={prop.image} alt={`Gallery ${i + 1}`} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-premium">
                <div className="container">
                    <div className="footer-top">
                        <div className="footer-cta">
                            <h2>Drop a line if you<br />want to collab</h2>
                        </div>
                        <div className="footer-links-grid">
                            <div className="footer-col">
                                <h4>Useful Link</h4>
                                <a href="#">Home</a>
                                <a href="#">About</a>
                                <a href="#">Works</a>
                                <a href="#">Contact</a>
                            </div>
                            <div className="footer-col">
                                <h4>Social Media</h4>
                                <a href="#">Facebook</a>
                                <a href="#">Twitter</a>
                                <a href="#">Instagram</a>
                                <a href="#">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-brand">
                        <span className="brand-name">ROOMGI</span>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 RoomGi. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
