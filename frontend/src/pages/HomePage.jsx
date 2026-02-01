import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import './HomePage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function HomePage({ onNavigate, onViewProperty }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStatIndex, setActiveStatIndex] = useState(0);

    // Fetch featured properties
    useEffect(() => {
        fetch(`${API_BASE_URL}/properties?limit=10`)
            .then(res => res.json())
            .then(data => {
                setFeaturedProperties(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching properties:', error);
                setLoading(false);
            });
    }, []);

    // Animate stats counter
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStatIndex(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();

        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.set('city', searchQuery);
        if (propertyType) params.set('property_type', propertyType);
        if (priceRange) {
            const [min, max] = priceRange.split('-');
            if (min) params.set('min_price', parseInt(min) * 100000);
            if (max && max !== '+') params.set('max_price', parseInt(max) * 100000);
        }

        // Navigate to browse with filters
        onNavigate('browse', params.toString());
    };

    return (
        <div className="homepage-new">
            {/* Animated Hero Section */}
            <section className="hero-vibrant">
                {/* Animated Background */}
                <div className="hero-bg-animated">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                    <div className="floating-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                        <div className="shape shape-4"></div>
                        <div className="shape shape-5"></div>
                    </div>
                </div>
                
                <div className="hero-content-vibrant">
                    <div className="hero-badge animate-fade-in">
                        <span>India's Most Trusted Property Platform</span>
                    </div>
                    
                    <h1 className="hero-title-vibrant animate-slide-up">
                        Find Your Perfect
                        <span className="title-gradient"> Dream Home</span>
                    </h1>
                    
                    <p className="hero-subtitle animate-slide-up-delay">
                        Discover 10,000+ verified properties across 50+ cities with virtual tours, 
                        AI-powered recommendations, and transparent pricing.
                    </p>

                    {/* Enhanced Search Bar */}
                    <form className="search-bar-vibrant animate-scale-in" onSubmit={handleSearch}>
                        <div className="search-input-group">
                            <span className="search-icon">◉</span>
                            <input
                                type="text"
                                placeholder="Enter city, locality or landmark..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="search-divider"></div>
                        <div className="search-select-group">
                            <span className="search-icon">⌂</span>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                            >
                                <option value="">All Property Types</option>
                                <option value="flat">Flat / Apartment</option>
                                <option value="villa">Villa / House</option>
                                <option value="pg">PG / Hostel</option>
                                <option value="plot">Plot / Land</option>
                            </select>
                        </div>
                        <div className="search-divider"></div>
                        <div className="search-select-group">
                            <span className="search-icon">₹</span>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                            >
                                <option value="">Any Budget</option>
                                <option value="0-50">Under ₹50 Lakh</option>
                                <option value="50-100">₹50L - 1 Crore</option>
                                <option value="100-200">₹1Cr - 2 Crore</option>
                                <option value="200+">Above ₹2 Crore</option>
                            </select>
                        </div>
                        <button type="submit" className="search-btn-vibrant">
                            <span>Search</span>
                            <span className="btn-arrow">→</span>
                        </button>
                    </form>

                    {/* Quick Tags */}
                    <div className="quick-tags animate-fade-in-delay">
                        <span className="tag-label">Popular:</span>
                        <button className="quick-tag" onClick={() => { setSearchQuery('Mumbai'); }}>Mumbai</button>
                        <button className="quick-tag" onClick={() => { setSearchQuery('Delhi'); }}>Delhi</button>
                        <button className="quick-tag" onClick={() => { setSearchQuery('Bangalore'); }}>Bangalore</button>
                        <button className="quick-tag" onClick={() => { setSearchQuery('Pune'); }}>Pune</button>
                        <button className="quick-tag" onClick={() => { setPropertyType('villa'); }}>Villas</button>
                    </div>
                </div>

                {/* Floating Stats Cards */}
                <div className="floating-stats">
                    <div className="floating-stat-card stat-card-1">
                        <span className="stat-value">10K+</span>
                        <span className="stat-label">Properties</span>
                    </div>
                    <div className="floating-stat-card stat-card-2">
                        <span className="stat-value">50K+</span>
                        <span className="stat-label">Happy Users</span>
                    </div>
                    <div className="floating-stat-card stat-card-3">
                        <span className="stat-value">50+</span>
                        <span className="stat-label">Cities</span>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-mouse">
                        <div className="scroll-wheel"></div>
                    </div>
                    <span>Scroll to explore</span>
                </div>
            </section>

            {/* Featured Properties Section */}
            <section className="section-vibrant featured-section">
                <div className="section-glow"></div>
                <div className="container">
                    <div className="section-header-vibrant">
                        <div className="section-badge">Hot Picks</div>
                        <h2>Featured Properties</h2>
                        <p>Handpicked properties just for you</p>
                    </div>

                    {loading ? (
                        <div className="loading-state-vibrant">
                            <div className="loading-spinner"></div>
                            <p>Finding amazing properties...</p>
                        </div>
                    ) : (
                        <div className="property-carousel-vibrant">
                            <div className="carousel-track-vibrant">
                                {featuredProperties.map(property => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        onViewProperty={onViewProperty}
                                        compact={true}
                                    />
                                ))}
                                {featuredProperties.map(property => (
                                    <PropertyCard
                                        key={`dup-${property.id}`}
                                        property={property}
                                        onViewProperty={onViewProperty}
                                        compact={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="cta-center">
                        <button
                            className="btn-vibrant btn-glow"
                            onClick={() => onNavigate('browse')}
                        >
                            <span>Explore All Properties</span>
                            <span className="btn-icon">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Animated Stats Section */}
            <section className="stats-section-vibrant">
                <div className="stats-bg-pattern"></div>
                <div className="container">
                    <div className="stats-grid-vibrant">
                        <div className={`stat-item-vibrant ${activeStatIndex === 0 ? 'active' : ''}`}>
                            <div className="stat-icon-wrapper">
                                <span className="stat-icon">⌂</span>
                            </div>
                            <div className="stat-content">
                                <h3 className="counter">500+</h3>
                                <p>Properties Listed</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                        <div className={`stat-item-vibrant ${activeStatIndex === 1 ? 'active' : ''}`}>
                            <div className="stat-icon-wrapper">
                                <span className="stat-icon">✓</span>
                            </div>
                            <div className="stat-content">
                                <h3 className="counter">1000+</h3>
                                <p>Happy Customers</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                        <div className={`stat-item-vibrant ${activeStatIndex === 2 ? 'active' : ''}`}>
                            <div className="stat-icon-wrapper">
                                <span className="stat-icon">■</span>
                            </div>
                            <div className="stat-content">
                                <h3 className="counter">50+</h3>
                                <p>Cities Covered</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                        <div className={`stat-item-vibrant ${activeStatIndex === 3 ? 'active' : ''}`}>
                            <div className="stat-icon-wrapper">
                                <span className="stat-icon">☎</span>
                            </div>
                            <div className="stat-content">
                                <h3 className="counter">24/7</h3>
                                <p>Customer Support</p>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section - NEW */}
            <section className="why-choose-section">
                <div className="container">
                    <div className="section-header-vibrant centered">
                        <div className="section-badge">Why ResiDo</div>
                        <h2>The Smarter Way to Find Your Home</h2>
                        <p>Experience property search like never before</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card feature-card-1">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">⌕</span>
                            </div>
                            <h3>AI-Powered Search</h3>
                            <p>Smart recommendations based on your preferences and budget</p>
                            <div className="feature-shine"></div>
                        </div>
                        <div className="feature-card feature-card-2">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">▶</span>
                            </div>
                            <h3>Virtual Tours</h3>
                            <p>360° property tours from the comfort of your home</p>
                            <div className="feature-shine"></div>
                        </div>
                        <div className="feature-card feature-card-3">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">✓</span>
                            </div>
                            <h3>Verified Listings</h3>
                            <p>Every property is verified for authenticity and accuracy</p>
                            <div className="feature-shine"></div>
                        </div>
                        <div className="feature-card feature-card-4">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">✉</span>
                            </div>
                            <h3>Direct Chat</h3>
                            <p>Connect instantly with property owners - no middlemen</p>
                            <div className="feature-shine"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section - Enhanced */}
            <section className="categories-section-vibrant">
                <div className="container">
                    <div className="section-header-vibrant centered">
                        <div className="section-badge">Explore</div>
                        <h2>Find Your Perfect Space</h2>
                        <p>Whether buying or renting, we've got you covered</p>
                    </div>

                    <div className="categories-grid-vibrant">
                        <div
                            className="category-card-vibrant category-buy"
                            onClick={() => onNavigate('browse', 'listing_type=buy')}
                        >
                            <div className="category-bg">
                                <img
                                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                                    alt="Buy Property"
                                />
                            </div>
                            <div className="category-overlay"></div>
                            <div className="category-content-vibrant">
                                <div className="category-icon-vibrant">
                                    <span>⌂</span>
                                </div>
                                <h3>Buy a Home</h3>
                                <p>Find your dream home from 1000+ listings</p>
                                <div className="category-arrow">
                                    <span>Explore →</span>
                                </div>
                            </div>
                            <div className="category-glow"></div>
                        </div>

                        <div
                            className="category-card-vibrant category-rent"
                            onClick={() => onNavigate('browse', 'listing_type=rent')}
                        >
                            <div className="category-bg">
                                <img
                                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
                                    alt="Rent Property"
                                />
                            </div>
                            <div className="category-overlay"></div>
                            <div className="category-content-vibrant">
                                <div className="category-icon-vibrant">
                                    <span>⚿</span>
                                </div>
                                <h3>Rent a Home</h3>
                                <p>Flexible rentals that match your lifestyle</p>
                                <div className="category-arrow">
                                    <span>Explore →</span>
                                </div>
                            </div>
                            <div className="category-glow"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Download / CTA Section - NEW */}
            <section className="cta-section-vibrant">
                <div className="cta-bg-animation">
                    <div className="cta-orb cta-orb-1"></div>
                    <div className="cta-orb cta-orb-2"></div>
                </div>
                <div className="container">
                    <div className="cta-content-vibrant">
                        <div className="cta-text">
                            <h2>Ready to Find Your Dream Home?</h2>
                            <p>Join thousands of happy homeowners who found their perfect property with ResiDo</p>
                            <div className="cta-buttons">
                                <button className="btn-vibrant btn-white" onClick={() => onNavigate('browse')}>
                                    Browse Properties
                                </button>
                                <button className="btn-vibrant btn-outline-white" onClick={() => onNavigate('owner-landing')}>
                                    List Your Property
                                </button>
                            </div>
                        </div>
                        <div className="cta-visual">
                            <div className="phone-mockup">
                                <div className="phone-screen">
                                    <div className="app-preview">
                                        <div className="preview-header">
                                            ResiDo
                                        </div>
                                        <div className="preview-card"></div>
                                        <div className="preview-card"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - NEW */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header-vibrant centered">
                        <div className="section-badge">Testimonials</div>
                        <h2>What Our Users Say</h2>
                        <p>Real stories from real home buyers</p>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-rating">★★★★★</div>
                            <p>"Found my dream apartment in just 2 weeks! The virtual tour feature saved me so much time."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">PS</div>
                                <div className="author-info">
                                    <strong>Priya Sharma</strong>
                                    <span>Mumbai</span>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card featured">
                            <div className="testimonial-rating">★★★★★</div>
                            <p>"The best property platform I've used. Transparent pricing, verified listings, and amazing support!"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">RK</div>
                                <div className="author-info">
                                    <strong>Rahul Kumar</strong>
                                    <span>Bangalore</span>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-rating">★★★★★</div>
                            <p>"Listed my property and got genuine inquiries within days. Highly recommend ResiDo!"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">AP</div>
                                <div className="author-info">
                                    <strong>Amit Patel</strong>
                                    <span>Delhi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer - Enhanced */}
            <footer className="footer-vibrant">
                <div className="footer-bg-pattern"></div>
                <div className="container">
                    <div className="footer-main">
                        <div className="footer-brand-vibrant">
                            <div className="footer-logo">
                                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#0074E4" />
                                            <stop offset="100%" stopColor="#00D4FF" />
                                        </linearGradient>
                                    </defs>
                                    <rect width="40" height="40" rx="10" fill="url(#footerLogoGradient)"/>
                                    <path d="M20 8L8 18V32H16V24H24V32H32V18L20 8Z" fill="white"/>
                                    <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradient)"/>
                                </svg>
                                <span>Resi<span className="highlight">Do</span></span>
                            </div>
                            <p>Your trusted partner in finding the perfect property. We connect property seekers with their dream homes using cutting-edge technology.</p>
                            <div className="social-links">
                                <a href="#" className="social-link">FB</a>
                                <a href="#" className="social-link">IG</a>
                                <a href="#" className="social-link">TW</a>
                                <a href="#" className="social-link">LI</a>
                            </div>
                        </div>
                        <div className="footer-links-grid">
                            <div className="footer-col-vibrant">
                                <h4>Quick Links</h4>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('browse'); }}>Browse Properties</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('tour'); }}>Virtual Tour</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('news'); }}>Property News</a>
                            </div>
                            <div className="footer-col-vibrant">
                                <h4>For Owners</h4>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('owner-landing'); }}>List Property</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('owner-dashboard'); }}>Owner Dashboard</a>
                            </div>
                            <div className="footer-col-vibrant">
                                <h4>Contact Us</h4>
                                <a href="mailto:contact@ResiDo.com">contact@ResiDo.com</a>
                                <a href="tel:+918909309988">+91 890 930 9988</a>
                                <a href="#">Mumbai, India</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom-vibrant">
                        <p>© 2026 ResiDo. Made in India. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
