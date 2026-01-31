import React, { useState } from 'react';
import './AdvancedFilters.css';

const CITIES = ['Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'];
const PROPERTY_TYPES = [
    { value: 'flat', label: 'Flat/Apartment' },
    { value: 'home', label: 'Independent House' },
    { value: 'villa', label: 'Villa' },
    { value: 'pg', label: 'PG/Paying Guest' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'room', label: 'Single Room' },
    { value: 'plot', label: 'Plot' },
    { value: 'commercial', label: 'Commercial' }
];
const AMENITIES = ['WiFi', 'AC', 'Parking', 'Gym', 'Laundry', 'Power Backup', 'Security', 'CCTV', 'Lift', 'Swimming Pool'];
const FURNISHED_OPTIONS = [
    { value: '', label: 'Any' },
    { value: 'fully-furnished', label: 'Fully Furnished' },
    { value: 'semi-furnished', label: 'Semi Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
];

function AdvancedFilters({ filters, onFilterChange, onApply, onClear }) {
    const [expandedSections, setExpandedSections] = useState(['location', 'property', 'lifestyle']);

    const toggleSection = (section) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const handleChange = (key, value) => {
        onFilterChange(key, value);
    };

    const handleAmenityToggle = (amenity) => {
        const current = filters.amenities ? filters.amenities.split(',').filter(a => a) : [];
        const updated = current.includes(amenity)
            ? current.filter(a => a !== amenity)
            : [...current, amenity];
        handleChange('amenities', updated.join(','));
    };

    const getActiveFilterCount = () => {
        let count = 0;
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== 'any') count++;
        });
        return count;
    };

    const isExpanded = (section) => expandedSections.includes(section);

    return (
        <div className="advanced-filters">
            <div className="filters-header">
                <h3>Advanced Filters</h3>
                {getActiveFilterCount() > 0 && (
                    <span className="active-count">{getActiveFilterCount()} active</span>
                )}
            </div>

            {/* LOCATION SECTION */}
            <div className="filter-section">
                <button className="section-header" onClick={() => toggleSection('location')}>
                    <span>Location</span>
                    <span className="toggle-icon">{isExpanded('location') ? '−' : '+'}</span>
                </button>
                {isExpanded('location') && (
                    <div className="section-content">
                        <div className="filter-row">
                            <label>City</label>
                            <select value={filters.city || ''} onChange={(e) => handleChange('city', e.target.value)}>
                                <option value="">All Cities</option>
                                {CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-row">
                            <label>Locality</label>
                            <input
                                type="text"
                                placeholder="e.g., Koramangala"
                                value={filters.locality || ''}
                                onChange={(e) => handleChange('locality', e.target.value)}
                            />
                        </div>
                        <div className="filter-row toggle-row">
                            <label>Near Metro Station</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={filters.near_metro === 'true'}
                                    onChange={(e) => handleChange('near_metro', e.target.checked ? 'true' : '')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="filter-row">
                            <label>Near College/Office</label>
                            <input
                                type="text"
                                placeholder="e.g., IIT, Christ University"
                                value={filters.near_college || ''}
                                onChange={(e) => handleChange('near_college', e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* PROPERTY SECTION */}
            <div className="filter-section">
                <button className="section-header" onClick={() => toggleSection('property')}>
                    <span>Property</span>
                    <span className="toggle-icon">{isExpanded('property') ? '−' : '+'}</span>
                </button>
                {isExpanded('property') && (
                    <div className="section-content">
                        <div className="filter-row">
                            <label>Property Type</label>
                            <select value={filters.property_type || ''} onChange={(e) => handleChange('property_type', e.target.value)}>
                                <option value="">All Types</option>
                                {PROPERTY_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-row">
                            <label>Listing Type</label>
                            <div className="radio-group">
                                <label className={`radio-option ${!filters.listing_type ? 'active' : ''}`}>
                                    <input type="radio" name="listing_type" value="" checked={!filters.listing_type} onChange={() => handleChange('listing_type', '')} />
                                    All
                                </label>
                                <label className={`radio-option ${filters.listing_type === 'sale' ? 'active' : ''}`}>
                                    <input type="radio" name="listing_type" value="sale" checked={filters.listing_type === 'sale'} onChange={() => handleChange('listing_type', 'sale')} />
                                    Buy
                                </label>
                            </div>
                        </div>
                        <div className="filter-row">
                            <label>Bedrooms</label>
                            <div className="bedroom-pills">
                                {['', '1', '2', '3', '4'].map(bed => (
                                    <button
                                        key={bed}
                                        className={`pill ${filters.bedrooms === bed ? 'active' : ''}`}
                                        onClick={() => handleChange('bedrooms', bed)}
                                    >
                                        {bed === '' ? 'Any' : `${bed} BHK`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-row">
                            <label>Furnished Status</label>
                            <select value={filters.furnished || ''} onChange={(e) => handleChange('furnished', e.target.value)}>
                                {FURNISHED_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* BUDGET SECTION */}
            <div className="filter-section">
                <button className="section-header" onClick={() => toggleSection('budget')}>
                    <span>Budget</span>
                    <span className="toggle-icon">{isExpanded('budget') ? '−' : '+'}</span>
                </button>
                {isExpanded('budget') && (
                    <div className="section-content">
                        <div className="filter-row price-range">
                            <label>Price Range (₹)</label>
                            <div className="range-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.min_price || ''}
                                    onChange={(e) => handleChange('min_price', e.target.value)}
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.max_price || ''}
                                    onChange={(e) => handleChange('max_price', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="filter-row">
                            <label>Max Deposit (months)</label>
                            <select value={filters.max_deposit_months || ''} onChange={(e) => handleChange('max_deposit_months', e.target.value)}>
                                <option value="">Any</option>
                                <option value="1">1 Month</option>
                                <option value="2">2 Months</option>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                            </select>
                        </div>
                        <div className="filter-row toggle-row">
                            <label>Maintenance Included</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={filters.maintenance_included === 'true'}
                                    onChange={(e) => handleChange('maintenance_included', e.target.checked ? 'true' : '')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* LIFESTYLE SECTION (Indian Market Specific) */}
            <div className="filter-section lifestyle-section">
                <button className="section-header" onClick={() => toggleSection('lifestyle')}>
                    <span>Lifestyle <span className="new-badge">Indian Market</span></span>
                    <span className="toggle-icon">{isExpanded('lifestyle') ? '−' : '+'}</span>
                </button>
                {isExpanded('lifestyle') && (
                    <div className="section-content">
                        <div className="filter-row toggle-row">
                            <label>Pet Friendly</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={filters.pet_friendly === 'true'}
                                    onChange={(e) => handleChange('pet_friendly', e.target.checked ? 'true' : '')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="filter-row toggle-row">
                            <label>Vegetarian Only</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={filters.vegetarian_only === 'true'}
                                    onChange={(e) => handleChange('vegetarian_only', e.target.checked ? 'true' : '')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="filter-row toggle-row">
                            <label>Bachelor Friendly</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={filters.bachelor_friendly === 'true'}
                                    onChange={(e) => handleChange('bachelor_friendly', e.target.checked ? 'true' : '')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="filter-row">
                            <label>Gender Preference</label>
                            <div className="radio-group">
                                <label className={`radio-option ${!filters.gender_preference || filters.gender_preference === 'any' ? 'active' : ''}`}>
                                    <input type="radio" name="gender" value="any" checked={!filters.gender_preference || filters.gender_preference === 'any'} onChange={() => handleChange('gender_preference', '')} />
                                    Any
                                </label>
                                <label className={`radio-option ${filters.gender_preference === 'male' ? 'active' : ''}`}>
                                    <input type="radio" name="gender" value="male" checked={filters.gender_preference === 'male'} onChange={() => handleChange('gender_preference', 'male')} />
                                    Male
                                </label>
                                <label className={`radio-option ${filters.gender_preference === 'female' ? 'active' : ''}`}>
                                    <input type="radio" name="gender" value="female" checked={filters.gender_preference === 'female'} onChange={() => handleChange('gender_preference', 'female')} />
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AVAILABILITY SECTION */}
            <div className="filter-section">
                <button className="section-header" onClick={() => toggleSection('availability')}>
                    <span>Availability</span>
                    <span className="toggle-icon">{isExpanded('availability') ? '−' : '+'}</span>
                </button>
                {isExpanded('availability') && (
                    <div className="section-content">
                        <div className="filter-row toggle-row">
                            <label>Immediate Availability</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={filters.immediate_available === 'true'}
                                    onChange={(e) => handleChange('immediate_available', e.target.checked ? 'true' : '')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="filter-row">
                            <label>Max Lease Duration</label>
                            <select value={filters.max_lease_months || ''} onChange={(e) => handleChange('max_lease_months', e.target.value)}>
                                <option value="">Any</option>
                                <option value="3">Up to 3 months</option>
                                <option value="6">Up to 6 months</option>
                                <option value="11">Up to 11 months</option>
                                <option value="12">Up to 12 months</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* AMENITIES SECTION */}
            <div className="filter-section">
                <button className="section-header" onClick={() => toggleSection('amenities')}>
                    <span>Amenities</span>
                    <span className="toggle-icon">{isExpanded('amenities') ? '−' : '+'}</span>
                </button>
                {isExpanded('amenities') && (
                    <div className="section-content">
                        <div className="amenities-grid">
                            {AMENITIES.map(amenity => {
                                const isSelected = filters.amenities?.split(',').includes(amenity);
                                return (
                                    <button
                                        key={amenity}
                                        className={`amenity-chip ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleAmenityToggle(amenity)}
                                    >
                                        {amenity}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="filter-actions">
                <button className="btn-apply" onClick={onApply}>
                    Apply Filters
                </button>
                <button className="btn-clear" onClick={onClear}>
                    Clear All
                </button>
            </div>
        </div>
    );
}

export default AdvancedFilters;
