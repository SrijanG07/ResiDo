import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar({ onNavigate, currentPage }) {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (e, page) => {
        e.preventDefault();
        onNavigate(page);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <a
                    href="#"
                    onClick={(e) => handleNavClick(e, 'home')}
                    className="navbar-logo"
                >
                    <div className="logo-icon">
                        <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#0074E4" />
                                    <stop offset="100%" stopColor="#00D4FF" />
                                </linearGradient>
                            </defs>
                            <rect width="40" height="40" rx="10" fill="url(#logoGradient)" />
                            <path d="M20 8L8 18V32H16V24H24V32H32V18L20 8Z" fill="white" />
                            <circle cx="20" cy="18" r="3" fill="url(#logoGradient)" />
                        </svg>
                    </div>
                    <span className="logo-text">Resi<span className="logo-highlight">Do</span></span>
                </a>

                {/* Desktop Navigation Links */}
                <ul className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => handleNavClick(e, 'browse')}
                            className={currentPage === 'browse' ? 'active' : ''}
                        >
                            Buy
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => handleNavClick(e, 'browse')}
                        >
                            Rent
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => handleNavClick(e, 'owner-landing')}
                        >
                            Sell
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => handleNavClick(e, 'tour')}
                            className={currentPage === 'tour' ? 'active' : ''}
                        >
                            Virtual Tour
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => handleNavClick(e, 'news')}
                            className={currentPage === 'news' ? 'active' : ''}
                        >
                            News
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => handleNavClick(e, 'market-analytics')}
                            className={currentPage === 'market-analytics' ? 'active' : ''}
                        >
                            Analytics
                        </a>
                    </li>
                </ul>

                {/* Actions */}
                <div className="navbar-actions">
                    {user ? (
                        <>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={(e) => handleNavClick(e, 'wishlist')}
                            >
                                Wishlist
                            </button>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={(e) => handleNavClick(e, 'messages')}
                            >
                                Messages
                            </button>
                            <span className="user-greeting">
                                {user.name?.split(' ')[0] || 'User'}
                            </span>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                    logout();
                                    onNavigate('home');
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={(e) => handleNavClick(e, 'user-login')}
                            style={{ marginRight: '8px' }}
                        >
                            Sign In / Sign Up
                        </button>
                    )}
                    <button
                        className="btn btn-cta-owner"
                        onClick={(e) => handleNavClick(e, 'owner-landing')}
                    >
                        List Property
                    </button>
                    <button
                        className="btn btn-emi"
                        onClick={(e) => handleNavClick(e, 'emi-calculator')}
                    >
                        Calculate EMI
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
