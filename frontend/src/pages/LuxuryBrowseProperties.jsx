import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { propertyService } from "../services/api";
import PropertyMap from "../components/PropertyMap";
import ChatWidget from "../components/ChatWidget";
import "../styles/luxury-theme.css";
import "./LuxuryBrowseProperties.css";

gsap.registerPlugin(ScrollTrigger);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Wishlist Button Component
function WishlistButton({ propertyId }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  // Check wishlist status lazily (only when user hovers or clicks)
  const checkWishlistStatus = async () => {
    if (checked) return; // Already checked
    const token = localStorage.getItem("ResiDo_token");
    if (!token) return;

    setChecked(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/wishlist/check/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setIsWishlisted(data.isWishlisted);
      }
    } catch (error) {
      console.error("Check wishlist error:", error);
    }
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("ResiDo_token");
    if (!token) {
      alert("Please login to save properties");
      return;
    }

    setIsLoading(true);
    try {
      const method = isWishlisted ? "DELETE" : "POST";
      const response = await fetch(`${API_BASE_URL}/wishlist/${propertyId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setIsWishlisted(!isWishlisted);
      }
    } catch (error) {
      console.error("Toggle wishlist error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`luxury-wishlist-btn ${isWishlisted ? "active" : ""} ${isLoading ? "loading" : ""}`}
      onClick={toggleWishlist}
      onMouseEnter={checkWishlistStatus}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isWishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

function LuxuryBrowseProperties({
  onViewProperty,
  onNavigate,
  initialFilters = "",
}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const animationRan = useRef(false);

  // Filter state
  const [filters, setFilters] = useState({
    city: "",
    min_price: 0,
    max_price: 20000000,
    property_type: [],
    listing_type: "",
    bedrooms: "",
    pet_friendly: false,
    bachelor_friendly: false,
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    // Animate cards only once on initial load
    if (
      !loading &&
      gridRef.current &&
      properties.length > 0 &&
      !animationRan.current
    ) {
      animationRan.current = true;
      gsap.fromTo(
        ".luxury-property-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out" },
      );
    }
  }, [loading]);

  const fetchProperties = async (customFilters = filters) => {
    setLoading(true);
    try {
      const cleanFilters = {};
      Object.entries(customFilters).forEach(([key, value]) => {
        if (
          value &&
          value !== "" &&
          value !== false &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          if (Array.isArray(value)) {
            cleanFilters[key] = value.join(",");
          } else {
            cleanFilters[key] = value;
          }
        }
      });
      const data = await propertyService.getProperties(cleanFilters);
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    fetchProperties(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      city: "",
      min_price: 0,
      max_price: 20000000,
      property_type: [],
      listing_type: "",
      bedrooms: "",
      pet_friendly: false,
      bachelor_friendly: false,
    };
    setFilters(emptyFilters);
    fetchProperties(emptyFilters);
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
    return `₹${price.toLocaleString()}`;
  };

  // Upgrade Unsplash image URLs to high resolution
  const upgradeImageUrl = (url) => {
    if (!url) return url;
    if (url.includes("unsplash.com")) {
      return url
        .replace(/w=\d+/, "w=800")
        .replace(/h=\d+/, "h=600")
        .replace(/q=\d+/, "q=85");
    }
    return url;
  };

  const getMapCenter = () => {
    const validProperties = properties.filter((p) => p.latitude && p.longitude);
    if (validProperties.length === 0) return [20.5937, 78.9629];
    const avgLat =
      validProperties.reduce((sum, p) => sum + parseFloat(p.latitude), 0) /
      validProperties.length;
    const avgLng =
      validProperties.reduce((sum, p) => sum + parseFloat(p.longitude), 0) /
      validProperties.length;
    return [avgLat, avgLng];
  };

  const CITIES = [
    "Bangalore",
    "Delhi",
    "Mumbai",
    "Pune",
    "Hyderabad",
    "Chennai",
  ];

  // Filter properties by search query (client-side)
  const filteredProperties = properties.filter((property) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (property.title && property.title.toLowerCase().includes(query)) ||
      (property.city && property.city.toLowerCase().includes(query)) ||
      (property.locality && property.locality.toLowerCase().includes(query)) ||
      (property.address && property.address.toLowerCase().includes(query)) ||
      (property.property_type &&
        property.property_type.toLowerCase().includes(query))
    );
  });

  return (
    <div className="luxury-browse">
      {/* Navigation Bar */}
      <nav className="luxury-browse__nav">
        <a
          href="#"
          className="luxury-browse__logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          ResiDo
        </a>
        <div className="luxury-browse__nav-links">
          <a href="#" className="active">
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
              onNavigate("wishlist");
            }}
          >
            Compare Properties
          </a>
        </div>
        <div className="luxury-browse__nav-actions">
          <button
            className="nav-icon-btn"
            onClick={() => onNavigate("wishlist")}
            title="Wishlist"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className="nav-icon-btn"
            onClick={() => onNavigate("messages")}
            title="Messages"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button
            className="luxury-browse__nav-cta"
            onClick={() => onNavigate("owner-landing")}
          >
            <span>List Property</span>
          </button>
          <button
            className="luxury-browse__nav-emi"
            onClick={() => onNavigate("emi-calculator")}
          >
            <span>Calculate EMI</span>
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="luxury-browse__header" ref={headerRef}>
        <div className="luxury-browse__header-content">
          <span className="luxury-browse__label">(Browse Collection)</span>
          <h1 className="luxury-browse__title">
            Find Your <span className="text-italic">Perfect</span> Home
          </h1>
          <p className="luxury-browse__subtitle">
            {filteredProperties.length} properties available
            {searchQuery && (
              <span className="search-result-text"> for "{searchQuery}"</span>
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="luxury-browse__search-bar">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="luxury-search-input"
              placeholder="Search by location, property type, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="luxury-browse__quick-filters">
          <button
            className={`quick-filter-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
            </svg>
            Filters
          </button>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === "map" ? "active" : ""}`}
              onClick={() => setViewMode("map")}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Filter Panel */}
      <div className={`luxury-filter-panel ${showFilters ? "open" : ""}`}>
        <div className="luxury-filter-panel__content">
          <div className="filter-section">
            <label>City</label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
            >
              <option value="">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label>Listing Type</label>
            <div className="filter-buttons">
              <button
                className={filters.listing_type === "" ? "active" : ""}
                onClick={() => handleFilterChange("listing_type", "")}
              >
                All
              </button>
              <button
                className={filters.listing_type === "sale" ? "active" : ""}
                onClick={() => handleFilterChange("listing_type", "sale")}
              >
                Buy
              </button>
            </div>
          </div>

          <div className="filter-section">
            <label>Bedrooms</label>
            <div className="filter-buttons">
              {["", "1", "2", "3", "4+"].map((bed) => (
                <button
                  key={bed}
                  className={filters.bedrooms === bed ? "active" : ""}
                  onClick={() => handleFilterChange("bedrooms", bed)}
                >
                  {bed || "Any"}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="20000000"
                step="500000"
                value={filters.max_price}
                onChange={(e) =>
                  handleFilterChange("max_price", parseInt(e.target.value))
                }
              />
              <span className="price-value">
                Up to {formatPrice(filters.max_price)}
              </span>
            </div>
          </div>

          <div className="filter-section">
            <label>Preferences</label>
            <div className="filter-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.pet_friendly}
                  onChange={(e) =>
                    handleFilterChange("pet_friendly", e.target.checked)
                  }
                />
                <span>Pet Friendly</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.bachelor_friendly}
                  onChange={(e) =>
                    handleFilterChange("bachelor_friendly", e.target.checked)
                  }
                />
                <span>Bachelor Friendly</span>
              </label>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn-filter-clear" onClick={clearFilters}>
              Clear All
            </button>
            <button className="btn-filter-apply" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="luxury-browse__content">
        {loading ? (
          <div className="luxury-loading">
            <div className="luxury-loading__spinner" />
            <p>Discovering properties...</p>
          </div>
        ) : (
          <>
            {viewMode === "map" ? (
              <div className="luxury-map-container">
                <PropertyMap
                  properties={properties}
                  center={getMapCenter()}
                  zoom={10}
                  onPropertyClick={onViewProperty}
                  showAmenities={false}
                />
              </div>
            ) : (
              <div className="luxury-properties-grid" ref={gridRef}>
                {filteredProperties.map((property) => (
                  <article
                    key={property.id}
                    className="luxury-property-card"
                    onClick={() => onViewProperty(property.id)}
                  >
                    <div className="luxury-property-card__image">
                      <img
                        src={
                          upgradeImageUrl(property.images?.[0]?.image_url) ||
                          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=85"
                        }
                        alt={property.title}
                        loading="lazy"
                      />
                      <span className="property-badge">
                        {property.listing_type === "sale"
                          ? "For Sale"
                          : "For Rent"}
                      </span>
                      <span
                        className="tour-badge"
                        title="360° Virtual Tour Available"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                          <path d="M2 12h20" />
                        </svg>
                        360°
                      </span>
                      <WishlistButton propertyId={property.id} />
                    </div>

                    <div className="luxury-property-card__content">
                      <div className="property-price">
                        {formatPrice(property.price)}
                        {property.listing_type === "rent" && (
                          <small>/month</small>
                        )}
                      </div>
                      <h3 className="property-title">{property.title}</h3>
                      <p className="property-location">
                        {property.locality}, {property.city}
                      </p>

                      <div className="property-meta">
                        {property.bedrooms && (
                          <span>{property.bedrooms} Bed</span>
                        )}
                        {property.bathrooms && (
                          <span>{property.bathrooms} Bath</span>
                        )}
                        {property.size && <span>{property.size} sqft</span>}
                      </div>

                      <div className="property-tags">
                        {property.pet_friendly && (
                          <span className="tag">Pets OK</span>
                        )}
                        {property.bachelor_friendly && (
                          <span className="tag">Bachelor</span>
                        )}
                        {property.near_metro && (
                          <span className="tag">Metro</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {properties.length === 0 && (
              <div className="luxury-no-results">
                <h3>No properties found</h3>
                <p>Try adjusting your filters to discover more options</p>
                <button className="btn-luxury" onClick={clearFilters}>
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* AI Chat Assistant */}
      <ChatWidget onViewProperty={onViewProperty} />
    </div>
  );
}

export default LuxuryBrowseProperties;
