import React, { useState, useEffect } from "react";
import "../styles/luxury-theme.css";
import "./WishlistPage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function WishlistPage({ onViewProperty, onNavigate }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("ResiDo_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (propertyId) => {
    const token = localStorage.getItem("ResiDo_token");
    try {
      await fetch(`${API_BASE_URL}/wishlist/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((p) => p.id !== propertyId));
      setSelectedForCompare((prev) => prev.filter((id) => id !== propertyId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const toggleCompareSelect = (propertyId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length < 3) {
        return [...prev, propertyId];
      }
      return prev;
    });
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price?.toLocaleString() || 0}`;
  };

  const getCompareItems = () => {
    return wishlist.filter((p) => selectedForCompare.includes(p.id));
  };

  if (loading) {
    return (
      <div className="wishlist-page loading">Loading your wishlist...</div>
    );
  }

  const token = localStorage.getItem("ResiDo_token");
  if (!token) {
    return (
      <div className="wishlist-page empty">
        <div className="empty-state">
          <span className="empty-icon">⚿</span>
          <h2>Please Login</h2>
          <p>Login to view and manage your saved properties</p>
          <button
            className="btn btn-primary"
            onClick={() => onNavigate && onNavigate("owner-login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <button
            className="btn btn-outline"
            onClick={() => onNavigate && onNavigate("home")}
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ← Back to Home
          </button>
          <h1>My Wishlist</h1>
          <p>{wishlist.length} saved properties</p>
        </div>
        <div className="header-actions">
          {wishlist.length >= 2 && (
            <button
              className={`btn ${compareMode ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedForCompare([]);
              }}
            >
              {compareMode ? "Exit Compare" : "Compare Properties"}
            </button>
          )}
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">♥</span>
          <h2>Your wishlist is empty</h2>
          <p>Browse properties and click the heart icon to save them</p>
          <button
            className="btn btn-primary"
            onClick={() => onNavigate && onNavigate("browse")}
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <>
          {compareMode && (
            <div className="compare-bar">
              <span>
                Select up to 3 properties to compare (
                {selectedForCompare.length}/3)
              </span>
              {selectedForCompare.length >= 2 && (
                <button className="btn btn-primary" onClick={() => {}}>
                  Compare Now
                </button>
              )}
            </div>
          )}

          <div className="wishlist-grid">
            {wishlist.map((property) => (
              <div
                key={property.id}
                className={`wishlist-card ${compareMode && selectedForCompare.includes(property.id) ? "selected" : ""}`}
                onClick={() => compareMode && toggleCompareSelect(property.id)}
              >
                {compareMode && (
                  <div className="compare-checkbox">
                    {selectedForCompare.includes(property.id) ? "✓" : ""}
                  </div>
                )}
                <div className="card-image">
                  <img
                    src={
                      property.images?.[0]?.image_url ||
                      property.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
                    }
                    alt={property.title}
                  />
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(property.id);
                    }}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
                <div className="card-content">
                  <h3>{property.title}</h3>
                  <p className="location">
                    {property.locality}, {property.city}
                  </p>
                  <div className="card-meta">
                    <span className="price">{formatPrice(property.price)}</span>
                    <span className="details">
                      {property.bedrooms} BHK • {property.size} sq.ft
                    </span>
                  </div>
                  {!compareMode && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProperty && onViewProperty(property.id);
                      }}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {compareMode && selectedForCompare.length >= 2 && (
            <div className="comparison-section">
              <h2>Property Comparison</h2>
              <div className="comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      {getCompareItems().map((p) => (
                        <th key={p.id}>{p.title?.substring(0, 20)}...</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Price</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id} className="highlight">
                          {formatPrice(p.price)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Size</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id}>{p.size} sq.ft</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Bedrooms</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id}>{p.bedrooms} BHK</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Bathrooms</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id}>{p.bathrooms}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Location</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id}>
                          {p.locality}, {p.city}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Type</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id} className="capitalize">
                          {p.property_type}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Furnished</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id} className="capitalize">
                          {p.furnished?.replace("-", " ")}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Price/sq.ft</td>
                      {getCompareItems().map((p) => (
                        <td key={p.id}>
                          ₹
                          {Math.round(p.price / (p.size || 1)).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WishlistPage;
