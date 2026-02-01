import React from "react";
import "./LuxuryFooter.css";

function LuxuryFooter({ onNavigate }) {
  return (
    <footer className="luxury-footer">
      <div className="luxury-footer__container">
        {/* Main Content */}
        <div className="luxury-footer__main">
          {/* Brand Section */}
          <div className="luxury-footer__brand">
            <h2 className="luxury-footer__logo">
              RESI<span className="text-accent">DO</span>
            </h2>
            <p className="luxury-footer__tagline">
              Your trusted partner in finding the perfect property. We connect
              property seekers with their dream homes using cutting-edge
              technology.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="luxury-footer__links">
            <div className="luxury-footer__col">
              <h4 className="luxury-footer__heading">Explore</h4>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("browse");
                    }}
                  >
                    All Properties
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("browse", "listing_type=buy");
                    }}
                  >
                    Buy a Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("browse", "listing_type=rent");
                    }}
                  >
                    Rent a Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("tour");
                    }}
                  >
                    Virtual Tours
                  </a>
                </li>
              </ul>
            </div>

            <div className="luxury-footer__col">
              <h4 className="luxury-footer__heading">For Owners</h4>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("owner-landing");
                    }}
                  >
                    List Your Property
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("owner-login");
                    }}
                  >
                    Owner Login
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("owner-dashboard");
                    }}
                  >
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>

            <div className="luxury-footer__col">
              <h4 className="luxury-footer__heading">Resources</h4>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("news");
                    }}
                  >
                    Property News
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("market-analytics");
                    }}
                  >
                    Market Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("about");
                    }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#">Buying Guide</a>
                </li>
              </ul>
            </div>

            <div className="luxury-footer__col">
              <h4 className="luxury-footer__heading">Contact</h4>
              <ul>
                <li>
                  <a href="mailto:contact@ResiDo.com">contact@ResiDo.com</a>
                </li>
                <li>
                  <a href="tel:+918909309988">+91 890 930 9988</a>
                </li>
                <li>
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="luxury-footer__bottom">
          <p className="luxury-footer__copyright">
            © {new Date().getFullYear()} ResiDo. All rights reserved.
          </p>
          <div className="luxury-footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LuxuryFooter;
