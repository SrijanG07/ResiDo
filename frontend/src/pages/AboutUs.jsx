import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/luxury-theme.css";
import "./AboutUs.css";

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
  {
    name: "Ridwan Umar",
    role: "Full Stack Developer",
    email: "ridwan.umar@iiitb.ac.in",
    phone: "+91 8882451901",
    image:
      "https://ui-avatars.com/api/?name=Ridwan+Umar&background=c9a962&color=0b0d0f&size=200&font-size=0.4",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Kshiteej Tiwari",
    role: "Full Stack Developer",
    email: "kshiteej.tiwari@iiitb.ac.in",
    phone: "+91 7030333308",
    image:
      "https://ui-avatars.com/api/?name=Kshiteej+Tiwari&background=c9a962&color=0b0d0f&size=200&font-size=0.4",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Srijan Gupta",
    role: "Full Stack Developer",
    email: "srijan.gupta@iiitb.ac.in",
    phone: "+91 9179646803",
    image:
      "https://ui-avatars.com/api/?name=Srijan+Gupta&background=c9a962&color=0b0d0f&size=200&font-size=0.4",
    linkedin: "#",
    github: "#",
  },
];

function AboutUs({ onNavigate }) {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(".about-hero__title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".about-hero__subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      // Reveal animations for sections
      gsap.utils.toArray(".about-reveal").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      // Team cards stagger
      gsap.from(".team-card", {
        scrollTrigger: {
          trigger: ".about-team__grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-page" ref={sectionRef}>
      {/* Navigation */}
      <nav className="about-nav">
        <a
          href="#"
          className="about-nav__logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          ROOM<span className="text-gold">Gi</span>
        </a>
        <button className="about-nav__back" onClick={() => onNavigate("home")}>
          ← Back to Home
        </button>
      </nav>

      {/* Hero Section */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-hero__bg"></div>
        <div className="about-hero__content">
          <span className="about-hero__label">(About Us)</span>
          <h1 className="about-hero__title">
            Building the Future of
            <br />
            <span className="text-italic text-gold">Real Estate</span>
          </h1>
          <p className="about-hero__subtitle">
            RoomGi is a cutting-edge real estate platform developed by students
            of IIIT Bangalore, combining innovative technology with seamless
            user experience to revolutionize property discovery in India.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="about-mission__container">
          <div className="about-mission__content about-reveal">
            <span className="section-label">(Our Mission)</span>
            <h2 className="section-title">
              Simplifying Property
              <br />
              <span className="text-italic">Discovery</span>
            </h2>
            <p className="section-description">
              We believe finding your dream home should be an exciting journey,
              not a stressful task. RoomGi eliminates intermediaries, provides
              verified listings, and offers immersive 360° virtual tours to help
              you make informed decisions from anywhere.
            </p>
          </div>
          <div className="about-mission__stats about-reveal">
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Verified Properties</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">50+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">360°</span>
              <span className="stat-label">Virtual Tours</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">AI Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Institution Section */}
      <section className="about-institution">
        <div className="about-institution__container">
          <div className="about-institution__content about-reveal">
            <span className="section-label">(Our Institution)</span>
            <h2 className="section-title">
              IIIT
              <br />
              <span className="text-italic text-gold">Bangalore</span>
            </h2>
            <p className="section-description">
              International Institute of Information Technology Bangalore
              (IIIT-B) is a premier institution known for its cutting-edge
              research and innovation in information technology.
            </p>
          </div>
          <div className="about-institution__details about-reveal">
            <div className="institution-card">
              <div className="institution-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="institution-card__content">
                <h4>Address</h4>
                <p>
                  26/C, Opposite Infosys Gate 10
                  <br />
                  Electronics City Phase 1, Hosur Road
                  <br />
                  Bengaluru - 560100
                  <br />
                  Karnataka, India
                </p>
              </div>
            </div>
            <div className="institution-card">
              <div className="institution-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="institution-card__content">
                <h4>Contact</h4>
                <p>
                  <a href="mailto:ridwan.umar@iiitb.ac.in">
                    ridwan.umar@iiitb.ac.in
                  </a>
                  <br />
                  <a href="mailto:kshiteej.tiwari@iiitb.ac.in">
                    kshiteej.tiwari@iiitb.ac.in
                  </a>
                  <br />
                  <a href="mailto:srijan.gupta@iiitb.ac.in">
                    srijan.gupta@iiitb.ac.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-cta__container about-reveal">
          <h2 className="about-cta__title">
            Ready to Find Your
            <br />
            <span className="text-italic">Dream Home?</span>
          </h2>
          <p className="about-cta__description">
            Explore our verified properties and experience the future of real
            estate.
          </p>
          <div className="about-cta__buttons">
            <button className="btn-luxury" onClick={() => onNavigate("browse")}>
              <span>Explore Properties</span>
            </button>
            <button
              className="btn-luxury-gold"
              onClick={() => onNavigate("tour")}
            >
              <span>Try Virtual Tour</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer__container">
          <p>
            © {new Date().getFullYear()} RoomGi. Developed at IIIT Bangalore.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AboutUs;
