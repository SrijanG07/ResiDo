import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../context/AuthContext";
import "./LuxuryHero.css";

gsap.registerPlugin(ScrollTrigger);

function LuxuryHero({ onNavigate }) {
  const { user, logout } = useAuth();
  const heroRef = useRef(null);
  const bgLayerFarRef = useRef(null);
  const bgLayerMidRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded
    setIsLoaded(true);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Create main timeline for pinned hero
        const heroTL = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 0.8,
            pin: true,
            pinSpacing: true,
          },
        });

        // Parallax background layers
        heroTL.to(
          bgLayerFarRef.current,
          {
            yPercent: -20,
            scale: 1.05,
            ease: "none",
          },
          0,
        );

        heroTL.to(
          bgLayerMidRef.current,
          {
            yPercent: -10,
            scale: 1.02,
            opacity: 0.6,
            ease: "none",
          },
          0,
        );

        // Content fade and move up
        heroTL.to(
          contentRef.current,
          {
            yPercent: -15,
            opacity: 0.3,
            ease: "power2.out",
          },
          0,
        );

        // Title specific animation
        heroTL.to(
          titleRef.current,
          {
            yPercent: -25,
            opacity: 0,
            ease: "power3.out",
          },
          0,
        );

        // Subtitle animation
        heroTL.to(
          subtitleRef.current,
          {
            yPercent: -10,
            opacity: 0,
            ease: "power2.out",
          },
          0.1,
        );

        // Refresh ScrollTrigger after setup
        ScrollTrigger.refresh();
      }, heroRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`luxury-hero ${isLoaded ? "loaded" : ""}`}
      ref={heroRef}
    >
      {/* Background Layers */}
      <div className="luxury-hero__bg">
        <div
          className="luxury-hero__bg-layer luxury-hero__bg-layer--far"
          ref={bgLayerFarRef}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')`,
          }}
        />
        <div
          className="luxury-hero__bg-layer luxury-hero__bg-layer--mid"
          ref={bgLayerMidRef}
        />
        <div className="luxury-hero__overlay" />
      </div>

      {/* Navigation */}
      <nav className="luxury-hero__nav">
        <a
          href="#"
          className="luxury-hero__logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          ResiDo
        </a>
        <div className="luxury-hero__nav-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("browse");
            }}
          >
            Properties
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("tour");
            }}
          >
            Virtual Tours
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("news");
            }}
          >
            News
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("market-analytics");
            }}
          >
            Analytics
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("wishlist");
            }}
          >
            Compare Properties
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("about");
            }}
          >
            About Us
          </a>
        </div>
        <div className="luxury-hero__nav-actions">
          {user ? (
            <>
              <button
                className="luxury-hero__nav-user"
                onClick={() => onNavigate("wishlist")}
              >
                <span>Wishlist</span>
              </button>
              <button
                className="luxury-hero__nav-user"
                onClick={() => onNavigate("messages")}
              >
                <span>Messages</span>
              </button>
              <span className="luxury-hero__nav-greeting">
                {user.name?.split(" ")[0] || "User"}
              </span>
              <button
                className="luxury-hero__nav-signin"
                onClick={() => {
                  logout();
                  onNavigate("home");
                }}
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              className="luxury-hero__nav-signin"
              onClick={() => onNavigate("user-login")}
            >
              <span>Sign In / Sign Up</span>
            </button>
          )}
          <button
            className="luxury-hero__nav-cta"
            onClick={() => onNavigate("owner-landing")}
          >
            <span>List Property</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="luxury-hero__content" ref={contentRef}>
        <div className="luxury-hero__text">
          <p className="luxury-hero__tagline">
            Find Your Perfect Home, Hassle-Free
          </p>

          <h1 className="luxury-hero__title" ref={titleRef}>
            <span className="luxury-hero__title-main">Resi</span>
            <span className="luxury-hero__title-accent">Do</span>
          </h1>

          <div className="luxury-hero__subtitle" ref={subtitleRef}>
            <p>
              Welcome to ResiDo - India's trusted platform for buying and
              selling properties. Browse verified listings, connect with sellers
              directly, and find your dream home without intermediaries.
            </p>
          </div>

          <div className="luxury-hero__actions">
            <button className="btn-luxury" onClick={() => onNavigate("browse")}>
              <span>Explore Properties</span>
            </button>
            <button
              className="btn-luxury-gold"
              onClick={() => onNavigate("tour")}
            >
              <span>Virtual Tours</span>
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="luxury-hero__info-card glass">
          <div className="luxury-hero__info-stat">
            <span className="stat-value">500+</span>
            <span className="stat-label">Verified Properties</span>
          </div>
          <div className="luxury-hero__info-divider" />
          <div className="luxury-hero__info-stat">
            <span className="stat-value">50+</span>
            <span className="stat-label">Cities Covered</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="luxury-hero__scroll">
        <span>Scroll</span>
        <div className="luxury-hero__scroll-line" />
      </div>
    </section>
  );
}

export default LuxuryHero;
