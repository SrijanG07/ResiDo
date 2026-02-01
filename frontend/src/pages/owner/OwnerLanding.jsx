import React from "react";
import "./OwnerLanding.css";

function OwnerLanding({ onLogin, onSignup, onBack }) {
  return (
    <div className="owner-landing">
      {/* Navigation */}
      <nav className="owner-nav">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="back-link"
        >
          ← Back to ResiDo
        </a>
      </nav>

      {/* Hero Section */}
      <section className="owner-hero">
        <div className="hero-content">
          <div className="hero-badge">Owner Hub</div>
          <h1>
            Turn Your Property Into
            <span className="text-gradient"> Passive Income</span>
          </h1>
          <p className="hero-subtitle">
            Join 1000+ property owners who maximize their ROI with our
            AI-powered pricing, analytics dashboard, and virtual tour
            technology.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={onLogin}>
              Sign In to Dashboard
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Analytics Dashboard</span>
            </div>
            <div className="preview-body">
              <div className="preview-card">
                <span className="preview-label">Total Views</span>
                <span className="preview-value">12,847</span>
                <span className="preview-change positive">+24%</span>
              </div>
              <div className="preview-card">
                <span className="preview-label">Inquiries</span>
                <span className="preview-value">156</span>
                <span className="preview-change positive">+18%</span>
              </div>
              <div className="preview-card">
                <span className="preview-label">Conversion</span>
                <span className="preview-value">4.2%</span>
                <span className="preview-change positive">+0.8%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="owner-features">
        <h2>Everything You Need to Succeed</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>Smart Analytics</h3>
            <p>
              Track views, inquiries, and conversion rates. Understand your
              market with real-time data.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">₹</div>
            <h3>AI Price Predictor</h3>
            <p>
              Get optimal pricing suggestions based on location, amenities, and
              market trends.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">○</div>
            <h3>360° Virtual Tours</h3>
            <p>
              Create immersive virtual tours that attract more qualified buyers.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">●</div>
            <h3>Location Intelligence</h3>
            <p>
              Showcase nearby amenities, metro stations, and colleges
              automatically.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✉</div>
            <h3>Inquiry Management</h3>
            <p>
              Manage all buyer inquiries in one place with quick-reply
              templates.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Trust Verification</h3>
            <p>
              Build credibility with verified badges that boost buyer
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="owner-cta">
        <div className="cta-content">
          <h2>Ready to Maximize Your Property's Potential?</h2>
          <p>Join the smartest property owners in India</p>
          <button className="btn btn-primary btn-lg" onClick={onLogin}>
            Get Started Free →
          </button>
        </div>
      </section>
    </div>
  );
}

export default OwnerLanding;
