import React, { useState, useRef } from "react";
import { uploadService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AddPropertyWizard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STEPS = [
  { id: 1, title: "Basic Details", icon: "1" },
  { id: 2, title: "Location", icon: "2" },
  { id: 3, title: "Lifestyle", icon: "3" },
  { id: 4, title: "Media", icon: "4" },
  { id: 5, title: "Review", icon: "5" },
];

const PROPERTY_TYPES = [
  { value: "flat", label: "Flat/Apartment" },
  { value: "home", label: "Independent House" },
  { value: "villa", label: "Villa" },
  { value: "pg", label: "PG/Paying Guest" },
  { value: "hostel", label: "Hostel" },
  { value: "room", label: "Single Room" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
];

function AddPropertyWizard({ onComplete }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const imageInputRef = useRef(null);
  const panoramaInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Basic Details
    title: "",
    description: "",
    property_type: "flat",
    listing_type: "sale",
    price: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    furnished: "unfurnished",
    // Location
    address: "",
    city: "",
    locality: "",
    pincode: "",
    latitude: "",
    longitude: "",
    // Lifestyle
    pet_friendly: false,
    vegetarian_only: false,
    bachelor_friendly: true,
    gender_preference: "any",
    near_metro: false,
    near_college: "",
    // Media
    images: [],
    panoramas: [],
  });
  const [predictedPrice, setPredictedPrice] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePredictPrice = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/predict-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: formData.city,
          locality: formData.locality,
          property_type: formData.property_type,
          listing_type: formData.listing_type,
          size: parseInt(formData.size) || 1000,
          bedrooms: parseInt(formData.bedrooms) || 2,
          bathrooms: parseInt(formData.bathrooms) || 1,
          furnished: formData.furnished,
          near_metro: formData.near_metro,
          pet_friendly: formData.pet_friendly,
          bachelor_friendly: formData.bachelor_friendly,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPredictedPrice(data);
      } else {
        // Fallback to simple calculation
        const basePrice =
          formData.property_type === "villa"
            ? 15000000
            : formData.property_type === "flat"
              ? 8000000
              : 5000000;
        const predicted =
          basePrice + (parseInt(formData.bedrooms) || 2) * 1500000;
        setPredictedPrice({ predictedPrice: predicted, confidence: 60 });
      }
    } catch (error) {
      console.error("Prediction error:", error);
      // Fallback calculation
      const basePrice =
        formData.property_type === "villa"
          ? 15000000
          : formData.property_type === "flat"
            ? 8000000
            : 5000000;
      const predicted =
        basePrice + (parseInt(formData.bedrooms) || 2) * 1500000;
      setPredictedPrice({ predictedPrice: predicted, confidence: 50 });
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting property:", formData);

    try {
      const token = localStorage.getItem("ResiDo_token");
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          owner_id: user?.id,
          state: "Karnataka", // Default for now
          postal_code: formData.pincode,
          // Convert image arrays to the format expected by backend
          imageUrls: formData.images.map((img) => img.url),
          panoramaUrls: formData.panoramas.map((img) => img.url),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      const data = await response.json();
      console.log("Property created:", data);
      onComplete();
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Failed to create property. Please try again.");
    }
  };

  // Image upload handlers
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);

    try {
      const results = await uploadService.uploadImages(files, "property");

      const newImages = results.images.map((img) => ({
        url: img.url,
        publicId: img.publicId,
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      setUploadProgress(`Successfully uploaded ${files.length} image(s)`);
      setTimeout(() => setUploadProgress(""), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress(`Error: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handlePanoramaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} panorama(s)...`);

    try {
      const results = await uploadService.uploadImages(files, "panorama");

      const newPanoramas = results.images.map((img) => ({
        url: img.url,
        publicId: img.publicId,
      }));

      setFormData((prev) => ({
        ...prev,
        panoramas: [...prev.panoramas, ...newPanoramas],
      }));

      setUploadProgress(`Successfully uploaded ${files.length} panorama(s)`);
      setTimeout(() => setUploadProgress(""), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress(`Error: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeImage = async (index, type) => {
    const imageArray =
      type === "panorama" ? formData.panoramas : formData.images;
    const image = imageArray[index];

    try {
      if (image.publicId) {
        await uploadService.deleteImage(image.publicId);
      }
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
    }

    setFormData((prev) => ({
      ...prev,
      [type === "panorama" ? "panoramas" : "images"]: imageArray.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="add-property-wizard">
      {/* Progress Steps */}
      <div className="wizard-progress">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`progress-step ${currentStep === step.id ? "active" : ""} ${currentStep > step.id ? "completed" : ""}`}
            onClick={() => currentStep > step.id && setCurrentStep(step.id)}
          >
            <span className="step-icon">
              {currentStep > step.id ? "✓" : step.icon}
            </span>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="wizard-content">
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Basic Details</h2>
            <p className="step-description">Tell us about your property</p>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Property Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Spacious 3 BHK in Koramangala"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Property Type *</label>
                <select
                  value={formData.property_type}
                  onChange={(e) => updateField("property_type", e.target.value)}
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Listing Type *</label>
                <div className="radio-group">
                  <label
                    className={`radio-option ${formData.listing_type === "sale" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="listing_type"
                      value="sale"
                      checked={formData.listing_type === "sale"}
                      onChange={() => updateField("listing_type", "sale")}
                    />
                    For Sale
                  </label>
                  <label
                    className={`radio-option ${formData.listing_type === "rent" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="listing_type"
                      value="rent"
                      checked={formData.listing_type === "rent"}
                      onChange={() => updateField("listing_type", "rent")}
                    />
                    For Rent
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  placeholder="Enter amount in ₹"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Bedrooms</label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => updateField("bedrooms", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => updateField("bathrooms", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="form-group">
                <label>Size (sq.ft)</label>
                <input
                  type="number"
                  placeholder="e.g., 1500"
                  value={formData.size}
                  onChange={(e) => updateField("size", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Furnished Status</label>
                <select
                  value={formData.furnished}
                  onChange={(e) => updateField("furnished", e.target.value)}
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi Furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  rows="4"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Location Details</h2>
            <p className="step-description">Where is your property located?</p>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Full Address *</label>
                <input
                  type="text"
                  placeholder="e.g., 123 Main Street, 4th Floor"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                >
                  <option value="">Select City</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              <div className="form-group">
                <label>Locality *</label>
                <input
                  type="text"
                  placeholder="e.g., Koramangala"
                  value={formData.locality}
                  onChange={(e) => updateField("locality", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  placeholder="e.g., 560034"
                  value={formData.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Map Location</label>
                <div className="map-placeholder">
                  <div className="map-message">
                    Interactive map coming soon
                    <br />
                    <small>
                      Enter coordinates manually or use the map to pick location
                    </small>
                  </div>
                  <div className="coord-inputs">
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={(e) => updateField("latitude", e.target.value)}
                    />
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Longitude"
                      value={formData.longitude}
                      onChange={(e) => updateField("longitude", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Lifestyle Preferences</h2>
            <p className="step-description">Help buyers find the right match</p>

            <div className="lifestyle-grid">
              <div className="lifestyle-card">
                <div className="lifestyle-header">
                  <span className="lifestyle-icon">P</span>
                  <span className="lifestyle-label">Pet Friendly</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.pet_friendly}
                    onChange={(e) =>
                      updateField("pet_friendly", e.target.checked)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="lifestyle-card">
                <div className="lifestyle-header">
                  <span className="lifestyle-icon">V</span>
                  <span className="lifestyle-label">Vegetarian Only</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.vegetarian_only}
                    onChange={(e) =>
                      updateField("vegetarian_only", e.target.checked)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="lifestyle-card">
                <div className="lifestyle-header">
                  <span className="lifestyle-icon">B</span>
                  <span className="lifestyle-label">Bachelor Friendly</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.bachelor_friendly}
                    onChange={(e) =>
                      updateField("bachelor_friendly", e.target.checked)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="lifestyle-card">
                <div className="lifestyle-header">
                  <span className="lifestyle-icon">M</span>
                  <span className="lifestyle-label">Near Metro</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.near_metro}
                    onChange={(e) =>
                      updateField("near_metro", e.target.checked)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: "2rem" }}>
              <div className="form-group">
                <label>Gender Preference (for PG/Hostel)</label>
                <select
                  value={formData.gender_preference}
                  onChange={(e) =>
                    updateField("gender_preference", e.target.value)
                  }
                >
                  <option value="any">Any</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
              </div>

              <div className="form-group">
                <label>Near College/Office</label>
                <input
                  type="text"
                  placeholder="e.g., Christ University, Infosys"
                  value={formData.near_college}
                  onChange={(e) => updateField("near_college", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Media */}
        {currentStep === 4 && (
          <div className="step-content">
            <h2>Property Media</h2>
            <p className="step-description">Add photos and virtual tours</p>

            {uploadProgress && (
              <div
                className={`upload-status ${uploadProgress.includes("Error") ? "error" : "success"}`}
              >
                {uploadProgress}
              </div>
            )}

            {/* Property Photos Section */}
            <div className="media-section">
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <div
                className={`upload-zone ${uploading ? "uploading" : ""}`}
                onClick={() => !uploading && imageInputRef.current?.click()}
              >
                <div className="upload-icon">📷</div>
                <h3>Property Photos</h3>
                <p>
                  {uploading
                    ? "Uploading..."
                    : "Click to browse or drag & drop images"}
                </p>
                <small>JPG, PNG up to 10MB each (Max 10 images)</small>
              </div>

              {/* Preview uploaded images */}
              {formData.images.length > 0 && (
                <div className="uploaded-images-grid">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="uploaded-image-item">
                      <img src={img.url} alt={`Property ${idx + 1}`} />
                      <button
                        className="remove-image-btn"
                        onClick={() => removeImage(idx, "image")}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panorama Section */}
            <div className="media-section">
              <input
                type="file"
                ref={panoramaInputRef}
                accept="image/*"
                multiple
                onChange={handlePanoramaUpload}
                style={{ display: "none" }}
              />
              <div
                className={`upload-zone panorama ${uploading ? "uploading" : ""}`}
                onClick={() => !uploading && panoramaInputRef.current?.click()}
              >
                <div className="upload-icon">🔄</div>
                <h3>360° Panoramas</h3>
                <p>
                  {uploading
                    ? "Uploading..."
                    : "Click to browse panoramic images"}
                </p>
                <small>
                  Equirectangular images recommended for virtual tours
                </small>
              </div>

              {/* Preview uploaded panoramas */}
              {formData.panoramas.length > 0 && (
                <div className="uploaded-images-grid">
                  {formData.panoramas.map((img, idx) => (
                    <div
                      key={idx}
                      className="uploaded-image-item panorama-item"
                    >
                      <img src={img.url} alt={`Panorama ${idx + 1}`} />
                      <span className="panorama-badge">360°</span>
                      <button
                        className="remove-image-btn"
                        onClick={() => removeImage(idx, "panorama")}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="media-note">
              <span>💡</span>
              <p>Properties with 360° tours get 3x more inquiries!</p>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="step-content">
            <h2>Review & Submit</h2>
            <p className="step-description">
              Review your listing before publishing
            </p>

            <div className="review-sections">
              <div className="review-card">
                <h3>Basic Details</h3>
                <div className="review-grid">
                  <div>
                    <span>Title:</span> {formData.title || "-"}
                  </div>
                  <div>
                    <span>Type:</span> {formData.property_type}
                  </div>
                  <div>
                    <span>Listing:</span> For {formData.listing_type}
                  </div>
                  <div>
                    <span>Price:</span> ₹{formData.price || "-"}
                  </div>
                  <div>
                    <span>Size:</span> {formData.size || "-"} sqft
                  </div>
                  <div>
                    <span>Rooms:</span> {formData.bedrooms || "-"} BHK
                  </div>
                </div>
              </div>

              <div className="review-card">
                <h3>Location</h3>
                <div className="review-grid">
                  <div>
                    <span>City:</span> {formData.city || "-"}
                  </div>
                  <div>
                    <span>Locality:</span> {formData.locality || "-"}
                  </div>
                  <div>
                    <span>Pincode:</span> {formData.pincode || "-"}
                  </div>
                </div>
              </div>

              <div className="review-card">
                <h3>Lifestyle</h3>
                <div className="review-badges">
                  {formData.pet_friendly && (
                    <span className="badge">Pet Friendly</span>
                  )}
                  {formData.vegetarian_only && (
                    <span className="badge">Veg Only</span>
                  )}
                  {formData.bachelor_friendly && (
                    <span className="badge">Bachelor OK</span>
                  )}
                  {formData.near_metro && (
                    <span className="badge">Near Metro</span>
                  )}
                </div>
              </div>

              {/* Price Predictor */}
              <div className="price-predictor">
                <div className="predictor-content">
                  <h3>AI Price Suggestion</h3>
                  <p>Get an optimal price based on market data</p>
                  {predictedPrice ? (
                    <div className="predicted-price">
                      <span>Suggested Price:</span>
                      <strong>
                        {formatPrice(
                          predictedPrice.predictedPrice || predictedPrice,
                        )}
                      </strong>
                      {predictedPrice.confidence && (
                        <div className="prediction-details">
                          <div className="confidence-bar">
                            <span>
                              Confidence: {predictedPrice.confidence}%
                            </span>
                            <div className="bar-bg">
                              <div
                                className="bar-fill"
                                style={{
                                  width: `${predictedPrice.confidence}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          {predictedPrice.priceRange && (
                            <div className="price-range">
                              Range:{" "}
                              {formatPrice(predictedPrice.priceRange.low)} -{" "}
                              {formatPrice(predictedPrice.priceRange.high)}
                            </div>
                          )}
                          {predictedPrice.marketComparison && (
                            <div
                              className={`market-status ${predictedPrice.marketComparison.status}`}
                            >
                              {predictedPrice.marketComparison.message}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="btn btn-outline"
                      onClick={handlePredictPrice}
                    >
                      Predict Optimal Price
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="wizard-navigation">
          <button
            className="btn btn-outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            ← Previous
          </button>

          {currentStep < 5 ? (
            <button className="btn btn-primary" onClick={nextStep}>
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}>
              Publish Property
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddPropertyWizard;
