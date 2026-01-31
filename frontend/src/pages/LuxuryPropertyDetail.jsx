import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { propertyService } from "../services/api";
import PropertyMap from "../components/PropertyMap";
import StreetViewModal from "../components/StreetViewModal";
import ReviewSection from "../components/ReviewSection";
import TrustBadge from "../components/TrustBadge";
import ScheduleVisitModal from "../components/ScheduleVisitModal";
import "../styles/luxury-theme.css";
import "./LuxuryPropertyDetail.css";

const amenityIcons = {
  school: { emoji: "S", label: "School" },
  hospital: { emoji: "H", label: "Hospital" },
  pharmacy: { emoji: "Rx", label: "Pharmacy" },
  supermarket: { emoji: "M", label: "Supermarket" },
  restaurant: { emoji: "R", label: "Restaurant" },
  bank: { emoji: "B", label: "Bank" },
  bus_station: { emoji: "BS", label: "Bus Stop" },
  subway_entrance: { emoji: "MT", label: "Metro" },
};

function LuxuryPropertyDetail({ propertyId, onBack, onNavigate, onStartTour }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nearbyAmenities, setNearbyAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    if (property?.latitude && property?.longitude) {
      fetchNearbyAmenities();
    }
  }, [property]);

  useEffect(() => {
    if (!loading && contentRef.current && property) {
      gsap.fromTo(
        ".luxury-detail__section",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      );
    }
  }, [loading]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getPropertyById(propertyId);
      setProperty(data);
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyAmenities = async () => {
    if (!property?.latitude || !property?.longitude) return;
    setAmenitiesLoading(true);
    const lat = parseFloat(property.latitude);
    const lng = parseFloat(property.longitude);
    const radius = 1500;
    const amenityTypes = [
      "school",
      "hospital",
      "pharmacy",
      "supermarket",
      "restaurant",
      "bank",
      "bus_station",
      "subway_entrance",
    ];
    const query = `[out:json][timeout:25];(${amenityTypes.map((type) => `node["amenity"="${type}"](around:${radius},${lat},${lng});`).join("")});out body;`;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
      const data = await response.json();
      const amenitiesWithDistance = (data.elements || [])
        .map((amenity) => {
          const distance = calculateDistance(
            lat,
            lng,
            amenity.lat,
            amenity.lon,
          );
          return {
            ...amenity,
            distance,
            type: amenity.tags?.amenity,
            name:
              amenity.tags?.name ||
              amenityIcons[amenity.tags?.amenity]?.label ||
              "Place",
          };
        })
        .sort((a, b) => a.distance - b.distance);
      setNearbyAmenities(amenitiesWithDistance);
    } catch (error) {
      console.error("Error fetching nearby amenities:", error);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (distanceKm) =>
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} km`;
  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
    return `₹${price.toLocaleString()}`;
  };

  // Upgrade Unsplash image URLs to high resolution (1600px)
  const upgradeImageUrl = (url) => {
    if (!url) return url;
    if (url.includes("unsplash.com")) {
      // Replace low-res parameters with high-res
      return url
        .replace(/w=\d+/, "w=1600")
        .replace(/h=\d+/, "h=1000")
        .replace(/q=\d+/, "q=90");
    }
    return url;
  };

  const sendInquiry = async () => {
    const token = localStorage.getItem("roomgi_token");
    if (!token) {
      alert("Please login to send a message");
      return;
    }
    if (!messageText.trim()) {
      alert("Please enter a message");
      return;
    }

    setSendingMessage(true);
    try {
      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_id: propertyId,
          message: messageText.trim(),
        }),
      });
      if (response.ok) {
        setMessageSent(true);
        setMessageText("");
        setTimeout(() => {
          setShowMessageModal(false);
          setMessageSent(false);
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Send inquiry error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const nextImage = () =>
    property.images?.length > 0 &&
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  const prevImage = () =>
    property.images?.length > 0 &&
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length,
    );
  const getDirections = () =>
    property?.latitude &&
    property?.longitude &&
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
      "_blank",
    );

  const groupedAmenities = nearbyAmenities.reduce((acc, amenity) => {
    const type = amenity.type || "other";
    if (!acc[type]) acc[type] = [];
    if (acc[type].length < 3) acc[type].push(amenity);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="luxury-detail luxury-detail--loading">
        <div className="luxury-loading">
          <div className="luxury-loading__spinner" />
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="luxury-detail luxury-detail--error">
        <h2>Property not found</h2>
        <button className="btn-luxury" onClick={onBack}>
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="luxury-detail">
      {/* Navigation */}
      <nav className="luxury-detail__nav">
        <a
          href="#"
          className="luxury-detail__logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.("home") || onBack();
          }}
        >
          ROOMGI
        </a>
        <button className="btn-back" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </button>
      </nav>

      {/* Hero Image Gallery */}
      <div className="luxury-detail__gallery">
        <div className="gallery-main">
          <img
            src={
              upgradeImageUrl(
                property.images?.[currentImageIndex]?.image_url,
              ) ||
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=1000&fit=crop&q=90"
            }
            alt={property.title}
          />
          {property.images?.length > 1 && (
            <>
              <button
                className="gallery-nav gallery-nav--prev"
                onClick={prevImage}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="gallery-nav gallery-nav--next"
                onClick={nextImage}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <div className="gallery-indicator">
                {property.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={idx === currentImageIndex ? "active" : ""}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {property.images?.length > 1 && (
          <div className="gallery-thumbs">
            {property.images.slice(0, 5).map((img, idx) => (
              <img
                key={idx}
                src={upgradeImageUrl(img.image_url)}
                alt={`View ${idx + 1}`}
                className={idx === currentImageIndex ? "active" : ""}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="luxury-detail__content" ref={contentRef}>
        {/* Main Info */}
        <div className="luxury-detail__main">
          <div className="luxury-detail__section luxury-detail__header">
            <div className="property-badge-row">
              <span className="property-type-badge">
                {property.listing_type === "sale" ? "For Sale" : "For Rent"}
              </span>
              <TrustBadge propertyId={propertyId} size="normal" />
            </div>
            <h1 className="property-title">{property.title}</h1>
            <p className="property-location">
              {property.address}, {property.locality}, {property.city}
            </p>
            <div className="property-price">
              {formatPrice(property.price)}
              {property.listing_type === "rent" && (
                <span className="price-suffix">/month</span>
              )}
            </div>

            {/* Virtual Tour Button */}
            {onStartTour && (
              <button
                className="btn-virtual-tour"
                onClick={() =>
                  onStartTour(propertyId, {
                    id: propertyId,
                    title: property.title,
                    location: `${property.locality}, ${property.city}`,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    sqft: property.size,
                    price: formatPrice(property.price),
                    type: property.property_type,
                  })
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                360° Virtual Tour
              </button>
            )}
          </div>

          <div className="luxury-detail__section property-stats">
            {property.bedrooms && (
              <div className="stat-item">
                <span className="stat-value">{property.bedrooms}</span>
                <span className="stat-label">Bedrooms</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="stat-item">
                <span className="stat-value">{property.bathrooms}</span>
                <span className="stat-label">Bathrooms</span>
              </div>
            )}
            {property.size && (
              <div className="stat-item">
                <span className="stat-value">{property.size}</span>
                <span className="stat-label">Sq Ft</span>
              </div>
            )}
            {property.furnished && (
              <div className="stat-item">
                <span className="stat-value">
                  {property.furnished
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
                <span className="stat-label">Furnishing</span>
              </div>
            )}
          </div>

          <div className="luxury-detail__section">
            <h2>Description</h2>
            <p className="property-description">
              {property.description || "No description available."}
            </p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="luxury-detail__section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-chip">
                    <span className="amenity-check">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.latitude && property.longitude && (
            <div className="luxury-detail__section">
              <div className="section-header">
                <h2>Location</h2>
                <div className="section-actions">
                  <button
                    className="btn-action"
                    onClick={() => setShowStreetView(true)}
                  >
                    Street View
                  </button>
                  <button
                    className="btn-action btn-action--primary"
                    onClick={getDirections}
                  >
                    Directions
                  </button>
                </div>
              </div>
              <div className="location-map">
                <PropertyMap
                  properties={[property]}
                  center={[
                    parseFloat(property.latitude),
                    parseFloat(property.longitude),
                  ]}
                  zoom={15}
                  showAmenities={showAmenities}
                />
              </div>
              {nearbyAmenities.length > 0 && (
                <div className="nearby-places">
                  <h3>What's Nearby</h3>
                  <div className="nearby-grid">
                    {Object.entries(groupedAmenities)
                      .slice(0, 4)
                      .map(([type, items]) => (
                        <div key={type} className="nearby-category">
                          <span className="category-icon">
                            {amenityIcons[type]?.emoji || "●"}
                          </span>
                          <span className="category-label">
                            {amenityIcons[type]?.label || type}
                          </span>
                          <span className="category-distance">
                            {formatDistance(items[0].distance)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="luxury-detail__section">
            <ReviewSection propertyId={propertyId} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="luxury-detail__sidebar">
          <div className="contact-card glass">
            <h3>
              Contact{" "}
              {property.owner?.user_type === "broker" ? "Broker" : "Owner"}
            </h3>
            <div className="owner-info">
              <div className="owner-avatar">
                {property.owner?.name?.charAt(0).toUpperCase() || "O"}
              </div>
              <div>
                <p className="owner-name">
                  {property.owner?.name || "Property Owner"}
                </p>
                <span className="owner-type">
                  {property.owner?.user_type?.toUpperCase() || "OWNER"}
                </span>
              </div>
            </div>
            {property.owner?.phone && (
              <a
                href={`https://wa.me/91${property.owner.phone.replace(/\D/g, "")}?text=Hi, I'm interested in your property: ${property.title} (${formatPrice(property.price)}) on RoomGi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            )}
            <button
              className="btn-luxury btn-luxury--full"
              onClick={() => setShowMessageModal(true)}
            >
              <span>Send Inquiry</span>
            </button>
            <button
              className="btn-luxury-outline btn-luxury--full"
              onClick={() => setShowScheduleModal(true)}
            >
              <span>Schedule Visit</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowMessageModal(false)}
        >
          <div className="luxury-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Message</h3>
              <button
                className="modal-close"
                onClick={() => setShowMessageModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-property-preview">
                <img
                  src={upgradeImageUrl(property.images?.[0]?.image_url) || ""}
                  alt={property.title}
                />
                <div>
                  <h4>{property.title}</h4>
                  <p>{formatPrice(property.price)}</p>
                </div>
              </div>
              {messageSent ? (
                <div className="message-success">
                  <span>✅</span>
                  <p>Message sent successfully!</p>
                </div>
              ) : (
                <>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Hi, I'm interested in this property. Is it still available?"
                    rows={4}
                  />
                  <button
                    className="btn-luxury btn-luxury--full"
                    onClick={sendInquiry}
                    disabled={sendingMessage}
                  >
                    <span>
                      {sendingMessage ? "Sending..." : "Send Message"}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Street View Modal */}
      {showStreetView && property?.latitude && property?.longitude && (
        <StreetViewModal
          latitude={parseFloat(property.latitude)}
          longitude={parseFloat(property.longitude)}
          propertyTitle={property.title}
          onClose={() => setShowStreetView(false)}
        />
      )}

      {/* Schedule Visit Modal */}
      {showScheduleModal && property && (
        <ScheduleVisitModal
          property={property}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}

export default LuxuryPropertyDetail;
