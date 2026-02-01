import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./ScheduleVisitModal.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ScheduleVisitModal({ property, onClose }) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    visit_date: "",
    visit_time: "",
    visitor_name: "",
    visitor_phone: "",
    visitor_email: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("ResiDo_token");
    if (!token) {
      setError("Please login to schedule a visit");
    }

    // Pre-fill user data if available
    if (user) {
      setFormData((prev) => ({
        ...prev,
        visitor_name: user.name || "",
        visitor_email: user.email || "",
        visitor_phone: user.phone || "",
      }));
    }
  }, [user]);

  // Generate time slots
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
  ];

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("ResiDo_token");
    console.log("Token found:", token ? "Yes" : "No");

    if (!token) {
      setError("Please login to schedule a visit");
      return;
    }

    // Validation
    if (!formData.visit_date || !formData.visit_time) {
      setError("Please select a date and time");
      return;
    }
    if (!formData.visitor_name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!formData.visitor_phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_id: property.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule visit");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error scheduling visit:", err);
      setError(err.message || "Failed to schedule visit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="schedule-modal-overlay" onClick={onClose}>
      <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
        <div className="schedule-modal__header">
          <h2>Schedule Property Visit</h2>
          <button className="schedule-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {success ? (
          <div className="schedule-modal__success">
            <div className="success-icon">✓</div>
            <h3>Visit Scheduled Successfully!</h3>
            <p>Your visit request has been sent to the property owner.</p>
            <p>They will confirm your appointment soon.</p>
            <div className="success-details">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(formData.visit_date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Time:</strong> {formData.visit_time}
              </p>
              <p>
                <strong>Property:</strong> {property.title}
              </p>
            </div>
            <button className="btn-schedule-done" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="schedule-modal__property">
              <img
                src={
                  property.images?.[0]?.image_url?.replace(
                    "http://",
                    "https://",
                  ) ||
                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
                }
                alt={property.title}
              />
              <div className="property-info">
                <h4>{property.title}</h4>
                <p className="property-location">{property.address}</p>
                <p className="property-price">
                  {formatPrice(property.price)}
                  {property.listing_type === "rent" ? "/month" : ""}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="schedule-modal__form">
              {error && <div className="schedule-error">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Select Date *</label>
                  <input
                    type="date"
                    name="visit_date"
                    value={formData.visit_date}
                    onChange={handleChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Select Time *</label>
                  <select
                    name="visit_time"
                    value={formData.visit_time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose time slot</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="visitor_name"
                  value={formData.visitor_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="visitor_phone"
                    value={formData.visitor_phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email (Optional)</label>
                  <input
                    type="email"
                    name="visitor_email"
                    value={formData.visitor_email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="btn-schedule-submit"
                disabled={loading || !localStorage.getItem("ResiDo_token")}
              >
                {loading ? "Scheduling..." : "Confirm Visit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ScheduleVisitModal;
