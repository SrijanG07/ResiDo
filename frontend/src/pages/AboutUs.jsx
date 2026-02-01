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
    image: "/Ridwan.jpg",
    github: "https://github.com/Ridwan-Umar",
  },
  {
    name: "Kkshiteej N Tiwari",
    role: "Full Stack Developer",
    email: "Kkshiteej.Tiwari@iiitb.ac.in",
    phone: "+91 7030333308",
    image: "/Kkshiteej.jpeg",
    github: "https://github.com/Kkshiteej-Tiwari",
  },
  {
    name: "Srijan Gupta",
    role: "Full Stack Developer",
    email: "srijan.gupta@iiitb.ac.in",
    phone: "+91 9179646803",
    image: "/Srijan.jpg",
    github: "https://github.com/SrijanG07",
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

      // Team cards - no animation, show immediately
      // gsap.from(".team-card", {
      //   scrollTrigger: {
      //     trigger: ".about-team__grid",
      //     start: "top 90%",
      //   },
      //   y: 30,
      //   opacity: 0,
      //   duration: 0.6,
      //   stagger: 0.1,
      //   ease: "power2.out",
      // });
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
          RESI<span className="text-gold">DO</span>
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
            ResiDo is a cutting-edge real estate platform developed by students
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
              not a stressful task. ResiDo eliminates intermediaries, provides
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
                  <a href="mailto:Kkshiteej.Tiwari@iiitb.ac.in">
                    Kkshiteej.Tiwari@iiitb.ac.in
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

      {/* Team Section */}
      <section className="about-team">
        <div className="about-team__container">
          <div className="about-team__header about-reveal">
            <span className="section-label">(Our Team)</span>
            <h2 className="section-title">
              Meet the
              <br />
              <span className="text-italic text-gold">Developers</span>
            </h2>
            <p className="section-description">
              The talented team behind ResiDo, bringing innovation to real estate.
            </p>
          </div>
          <div className="about-team__grid">
            {TEAM_MEMBERS.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-card__image">
                  <img src={member.image} alt={member.name} />
                  <div className="team-card__overlay">
                    <a href={member.github} className="team-card__social" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="team-card__info">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <div className="team-card__contact">
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                    <a href={`tel:${member.phone}`}>{member.phone}</a>
                  </div>
                </div>
              </div>
            ))}
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
            © {new Date().getFullYear()} ResiDo. Developed at IIIT Bangalore.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AboutUs;
