import React, { useState } from 'react';

function FilterPanel({ filters, onFilterChange, propertyCount }) {
    const [priceRange, setPriceRange] = useState([filters.min_price || 0, filters.max_price || 20000000]);

    const amenitiesList = [
        { id: 'parking', label: 'Parking' },
        { id: 'gym', label: 'Gym' },
        { id: 'swimming_pool', label: 'Swimming Pool' },
        { id: 'club_house', label: 'Club House' },
        { id: 'security', label: 'Security' },
        { id: 'wifi', label: 'Wi-Fi' },
        { id: 'power_backup', label: 'Power Backup' },
    ];

    const handlePriceChange = (e, index) => {
        const newRange = [...priceRange];
        newRange[index] = parseInt(e.target.value);
        setPriceRange(newRange);
        onFilterChange({
            ...filters,
            min_price: newRange[0],
            max_price: newRange[1]
        });
    };

    const togglePropertyType = (type) => {
        const currentTypes = filters.property_type || [];
        const newTypes = currentTypes.includes(type)
            ? currentTypes.filter(t => t !== type)
            : [...currentTypes, type];
        onFilterChange({ ...filters, property_type: newTypes });
    };

    const toggleAmenity = (amenity) => {
        const currentAmenities = filters.amenities || [];
        const newAmenities = currentAmenities.includes(amenity)
            ? currentAmenities.filter(a => a !== amenity)
            : [...currentAmenities, amenity];
        onFilterChange({ ...filters, amenities: newAmenities });
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <aside className="filter-panel">
            <div className="filter-header">
                <h3>Filters</h3>
                {propertyCount !== undefined && (
                    <span className="result-count">{propertyCount} properties found</span>
                )}
                <button
                    className="btn-clear-filters"
                    onClick={() => onFilterChange({})}
                >
                    Clear All
                </button>
            </div>

            {/* Price Range */}
            <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range-slider">
                    <div className="price-labels">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="20000000"
                        step="100000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="range-input"
                    />
                    <input
                        type="range"
                        min="0"
                        max="20000000"
                        step="100000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="range-input"
                    />
                </div>
            </div>

            {/* Property Type */}
            <div className="filter-section">
                <h4>Property Type</h4>
                <div className="checkbox-group">
                    {['flat', 'pg', 'villa', 'plot'].map(type => (
                        <label key={type} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={(filters.property_type || []).includes(type)}
                                onChange={() => togglePropertyType(type)}
                            />
                            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Bedrooms */}
            <div className="filter-section">
                <h4>Bedrooms</h4>
                <div className="button-group">
                    {[1, 2, 3, 4].map(num => (
                        <button
                            key={num}
                            className={`btn-filter ${filters.bedrooms === num ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, bedrooms: num })}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        className={`btn-filter ${filters.bedrooms === 5 ? 'active' : ''}`}
                        onClick={() => onFilterChange({ ...filters, bedrooms: 5 })}
                    >
                        4+
                    </button>
                </div>
            </div>

            {/* Lifestyle */}
            <div className="filter-section">
                <h4>Lifestyle</h4>
                <div className="lifestyle-toggles">
                    <button
                        className={`lifestyle-toggle pet ${filters.pet_friendly ? 'active' : ''}`}
                        onClick={() => onFilterChange({ ...filters, pet_friendly: !filters.pet_friendly })}
                    >
                        Pet-friendly
                    </button>
                    <button
                        className={`lifestyle-toggle veg ${filters.vegetarian_only ? 'active' : ''}`}
                        onClick={() => onFilterChange({ ...filters, vegetarian_only: !filters.vegetarian_only })}
                    >
                        Veg-only
                    </button>
                    <button
                        className={`lifestyle-toggle bachelor ${filters.bachelor_friendly ? 'active' : ''}`}
                        onClick={() => onFilterChange({ ...filters, bachelor_friendly: !filters.bachelor_friendly })}
                    >
                        Bachelor-friendly
                    </button>
                </div>
            </div>

            {/* Amenities */}
            <div className="filter-section">
                <h4>Amenities</h4>
                <div className="checkbox-group">
                    {amenitiesList.map(amenity => (
                        <label key={amenity.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={(filters.amenities || []).includes(amenity.id)}
                                onChange={() => toggleAmenity(amenity.id)}
                            />
                            <span>{amenity.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default FilterPanel;
