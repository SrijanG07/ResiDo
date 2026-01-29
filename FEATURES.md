V# RoomGi - Comprehensive Feature Documentation

> **A Unified Property Management & Discovery Platform**  
> Combining Rental Discovery, Buy-Sell Listings, and Owner Management

---

## Table of Contents

1. [Virtual Tours & 360-Degree Views](#feature-1-virtual-tours--360-degree-views)
2. [Interactive Map Integration](#feature-2-interactive-map-integration)
3. [Advanced Search & Filtering System](#feature-3-advanced-search--filtering-system)
4. [User Authentication & Verification System](#feature-4-user-authentication--verification-system)
5. [Property Listing Management (Owner Dashboard)](#feature-5-property-listing-management-owner-dashboard)
6. [User Reviews & Rating System](#feature-6-user-reviews--rating-system)
7. [Smart Price Prediction & Comparison](#feature-7-smart-price-prediction--comparison)
8. [Real-Time Messaging & Inquiry System](#feature-8-real-time-messaging--inquiry-system)
9. [Wishlist & Favorites System](#feature-9-wishlist--favorites-system)
10. [Analytics Dashboard for Owners](#feature-10-analytics-dashboard-for-owners)
11. [Responsive Mobile-First Design](#feature-11-responsive-mobile-first-design)
12. [Fraud Detection & Listing Verification](#feature-12-fraud-detection--listing-verification)

---

# Feature 1: Virtual Tours & 360-Degree Views

## Problem Statement

Traditional property listings rely heavily on static images that fail to capture the true essence of a property. According to Zhang & Troncoso (2023), conventional property search methods frequently fall short, providing only basic details and still photos that don't adequately convey the spirit of a home. This creates a significant gap between what renters/buyers expect and what they actually experience upon visiting.

### Key Issues:
- **Limited Visual Information**: 2D images cannot show room dimensions, natural lighting, or spatial flow
- **Deceptive Photography**: Wide-angle lenses and editing can misrepresent actual property conditions
- **Wasted Site Visits**: Users travel to properties only to find they don't match expectations
- **Trust Deficit**: Lack of transparency leads to suspicion between renters and property owners
- **Geographic Barriers**: Long-distance users cannot properly evaluate properties before committing

### Impact Statistics:
- 67% of property seekers report disappointment after physical visits due to photo misrepresentation
- Average user visits 5-7 properties before finding a suitable match
- Virtual tours increase user engagement by 300% compared to static listings (NAR, 2023)

---

## Solution Overview

RoomGi integrates **Mapillary's street-level imagery** and **360-degree virtual tour capabilities** to provide immersive property exploration. Users can virtually "walk through" properties, examining every corner as if physically present.

### What This Solves:
1. **Transparency**: Users see exactly what they'll get—no surprises
2. **Time Savings**: Pre-filter properties virtually before scheduling visits
3. **Trust Building**: Authentic visuals establish credibility for property owners
4. **Accessibility**: Remote users can explore properties from anywhere in the world
5. **Competitive Advantage**: Stand out from traditional listing platforms

---

## Technical Implementation

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ 360° Viewer │  │ Image       │  │ Street View         │ │
│  │ (Pannellum) │  │ Gallery     │  │ (Mapillary API)     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    MEDIA SERVICE                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Image Processing & Optimization                    │   │
│  │ • 360° Photo Stitching                               │   │
│  │ • CDN Integration (Cloudinary)                       │   │
│  │ • Lazy Loading & Progressive Enhancement             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| 360° Viewer | Pannellum.js | Open-source panoramic viewer |
| Street View | Mapillary API | Crowdsourced street-level imagery |
| Image Storage | Cloudinary | CDN with auto-optimization |
| Image Upload | Multer + Sharp | Server-side processing |
| Frontend | React + Three.js | Interactive 3D rendering |

### API Integration: Mapillary

```javascript
// Example: Fetching nearby street-level images
const MAPILLARY_ACCESS_TOKEN = process.env.MAPILLARY_TOKEN;

async function getStreetViewImages(latitude, longitude, radius = 100) {
  const endpoint = `https://graph.mapillary.com/images`;
  const params = new URLSearchParams({
    access_token: MAPILLARY_ACCESS_TOKEN,
    fields: 'id,captured_at,compass_angle,thumb_1024_url,geometry',
    bbox: calculateBoundingBox(latitude, longitude, radius),
    limit: 10
  });
  
  const response = await fetch(`${endpoint}?${params}`);
  return response.json();
}

// Display in React component
function StreetViewGallery({ propertyLocation }) {
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    getStreetViewImages(propertyLocation.lat, propertyLocation.lng)
      .then(data => setImages(data.data));
  }, [propertyLocation]);
  
  return (
    <div className="street-view-gallery">
      {images.map(img => (
        <img 
          key={img.id} 
          src={img.thumb_1024_url} 
          alt={`Street view from ${new Date(img.captured_at).toLocaleDateString()}`}
        />
      ))}
    </div>
  );
}
```

### 360° Panorama Viewer Implementation

```javascript
// Using Pannellum for 360° views
import { Pannellum } from 'pannellum-react';

function VirtualTour({ panoramaImages }) {
  const [currentScene, setCurrentScene] = useState(0);
  
  const scenes = panoramaImages.map((img, index) => ({
    id: `scene_${index}`,
    type: 'equirectangular',
    panorama: img.url,
    autoLoad: index === 0,
    hotSpots: img.hotspots || []
  }));
  
  return (
    <div className="virtual-tour-container">
      <Pannellum
        width="100%"
        height="500px"
        image={scenes[currentScene].panorama}
        pitch={10}
        yaw={180}
        hfov={110}
        autoLoad
        showControls
        hotSpots={scenes[currentScene].hotSpots}
      />
      
      <div className="scene-navigation">
        {scenes.map((scene, idx) => (
          <button 
            key={scene.id}
            className={idx === currentScene ? 'active' : ''}
            onClick={() => setCurrentScene(idx)}
          >
            {scene.label || `Room ${idx + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Database Schema for Media

```sql
-- Property Images Table
CREATE TABLE property_images (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  image_type ENUM('standard', 'panorama_360', 'floor_plan') DEFAULT 'standard',
  room_label VARCHAR(50),  -- "Living Room", "Kitchen", etc.
  display_order INT DEFAULT 0,
  width INT,
  height INT,
  file_size INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Virtual Tour Hotspots (for navigation between 360° scenes)
CREATE TABLE tour_hotspots (
  id SERIAL PRIMARY KEY,
  source_image_id INT REFERENCES property_images(id),
  target_image_id INT REFERENCES property_images(id),
  pitch DECIMAL(5,2),  -- Vertical position
  yaw DECIMAL(5,2),    -- Horizontal position
  label VARCHAR(100),
  icon VARCHAR(50) DEFAULT 'navigate'
);
```

---

## User Flow

```
┌──────────────┐     ┌───────────────┐     ┌─────────────────┐
│ User browses │────▶│ Clicks on     │────▶│ Gallery opens   │
│ listings     │     │ property card │     │ with thumbnails │
└──────────────┘     └───────────────┘     └────────┬────────┘
                                                    │
                     ┌───────────────┐              │
                     │ Full immersive│◀─────────────┘
                     │ 360° tour     │     User clicks "Virtual Tour"
                     └───────┬───────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Navigate rooms│    │ View street   │    │ Compare with  │
│ via hotspots  │    │ surroundings  │    │ floor plan    │
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## Expected Outcomes

| Metric | Before Implementation | After Implementation |
|--------|----------------------|---------------------|
| Average session duration | 2-3 minutes | 5-8 minutes |
| Properties viewed per session | 8-10 | 15-20 |
| Site visit conversion rate | 15% | 40% |
| User trust score (survey) | 3.2/5 | 4.5/5 |
| Bounce rate on listings | 65% | 35% |

---

## Research References

1. **Zhang, M., & Troncoso, I. (2023)**. "Beyond the Hype: Unveiling the Marginal Benefits of 3D Virtual Tours in Real Estate." Harvard Business School.
2. **Ngelambong et al. (2024)**. "Assessing 360-degree guided Virtual Tour Video as a Viable Tourism Destination Marketing Tool." IJRISS.
3. **Google Scholar**: [Virtual Tours Real Estate Research](https://scholar.google.com/scholar?q=virtual+tours+real+estate+property+marketing)

---

# Feature 2: Interactive Map Integration

## Problem Statement

Property seekers often struggle to understand a property's location context. Traditional listings provide only an address, leaving users confused about the surrounding environment, accessibility, and neighborhood quality.

### Key Issues:
- **Unclear Location Context**: Users don't know what's nearby (schools, hospitals, metro stations)
- **Distance Estimation Problems**: Hard to judge commute times without visualization
- **Neighborhood Uncertainty**: No way to assess area safety, noise levels, or community vibe
- **Multiple Platform Switching**: Users must leave the listing site to check Google Maps
- **Location-Based Filtering Gaps**: Cannot search by "within 2km of my workplace"

### Impact:
- 78% of renters consider location as their #1 priority (NAR, 2023)
- Users spend average 15 extra minutes externally researching locations
- 23% of rental cancellations occur due to location-related surprises

---

## Solution Overview

RoomGi integrates **OpenStreetMap + Leaflet.js** for interactive mapping with:
- Property location markers with clustering
- Nearby amenities visualization (schools, hospitals, metro, grocery)
- Distance radius search
- Route calculation to key destinations
- Neighborhood boundary highlighting

### What This Solves:
1. **Context Clarity**: See everything around the property at a glance
2. **Informed Decisions**: Evaluate commute, amenities, and environment
3. **Streamlined Experience**: No need to switch platforms
4. **Advanced Filtering**: Search by location radius and proximity
5. **Trust Building**: Transparent location representation

---

## Technical Implementation

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      MAP LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Leaflet.js  │  │ Marker      │  │ Routing (OSRM)      │ │
│  │ Map Renderer│  │ Clustering  │  │ Distance Calc       │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │OpenStreetMap│  │ Nominatim   │  │ Overpass API        │ │
│  │ Tiles       │  │ Geocoding   │  │ POI Data            │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose | Free Tier |
|-----------|------------|---------|-----------|
| Map Tiles | OpenStreetMap | Base map display | Unlimited |
| Rendering | Leaflet.js | Interactive map library | Open-source |
| Geocoding | Nominatim | Address ↔ Coordinates | 1 req/sec |
| POI Data | Overpass API | Nearby amenities | Unlimited |
| Routing | OSRM | Distance & directions | Self-hosted free |

### React Component Implementation

```javascript
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';

function PropertyMap({ properties, center, onPropertySelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(null);

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [center.lat, center.lng], 
        13
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Initialize marker cluster group
      markersRef.current = L.markerClusterGroup();
      mapInstanceRef.current.addLayer(markersRef.current);
    }

    // Clear existing markers
    markersRef.current.clearLayers();

    // Add property markers
    properties.forEach(property => {
      const marker = L.marker([property.latitude, property.longitude])
        .bindPopup(`
          <div class="map-popup">
            <img src="${property.thumbnail}" alt="${property.title}" />
            <h4>${property.title}</h4>
            <p class="price">₹${property.price}/month</p>
            <p class="address">${property.address}</p>
            <button onclick="viewProperty(${property.id})">View Details</button>
          </div>
        `);
      
      marker.on('click', () => onPropertySelect(property));
      markersRef.current.addLayer(marker);
    });

    // Fit bounds to show all markers
    if (properties.length > 0) {
      const bounds = markersRef.current.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, center]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
}
```

### Nearby Amenities Fetching (Overpass API)

```javascript
async function fetchNearbyAmenities(lat, lng, radius = 1000) {
  const amenityTypes = [
    'school', 'hospital', 'pharmacy', 'supermarket', 
    'restaurant', 'bank', 'atm', 'bus_station', 'subway_entrance'
  ];
  
  const query = `
    [out:json][timeout:25];
    (
      ${amenityTypes.map(type => `
        node["amenity"="${type}"](around:${radius},${lat},${lng});
      `).join('')}
    );
    out body;
  `;
  
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query
  });
  
  const data = await response.json();
  
  // Group by amenity type
  return data.elements.reduce((acc, element) => {
    const type = element.tags.amenity;
    if (!acc[type]) acc[type] = [];
    acc[type].push({
      name: element.tags.name || `${type}`,
      lat: element.lat,
      lng: element.lon,
      distance: calculateDistance(lat, lng, element.lat, element.lon)
    });
    return acc;
  }, {});
}

// Haversine formula for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c * 1000).toFixed(0); // Return in meters
}
```

### Amenities Display Component

```javascript
function NearbyAmenities({ propertyLocation }) {
  const [amenities, setAmenities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNearbyAmenities(propertyLocation.lat, propertyLocation.lng)
      .then(data => {
        setAmenities(data);
        setLoading(false);
      });
  }, [propertyLocation]);

  const amenityIcons = {
    school: '🏫',
    hospital: '🏥',
    pharmacy: '💊',
    supermarket: '🛒',
    restaurant: '🍽️',
    bank: '🏦',
    bus_station: '🚌',
    subway_entrance: '🚇'
  };

  if (loading) return <div>Loading nearby places...</div>;

  return (
    <div className="nearby-amenities">
      <h3>What's Nearby</h3>
      <div className="amenity-grid">
        {Object.entries(amenities).map(([type, places]) => (
          <div key={type} className="amenity-category">
            <span className="icon">{amenityIcons[type] || '📍'}</span>
            <span className="type">{type.replace('_', ' ')}</span>
            <span className="count">{places.length} within 1km</span>
            <span className="nearest">
              Nearest: {Math.min(...places.map(p => p.distance))}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Database Schema for Location Data

```sql
-- Properties table already has lat/lng
-- Add indexes for geo-queries
CREATE INDEX idx_properties_location ON properties(latitude, longitude);

-- Cached amenities (to reduce API calls)
CREATE TABLE cached_amenities (
  id SERIAL PRIMARY KEY,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  radius INT DEFAULT 1000,
  amenity_type VARCHAR(50),
  amenity_name VARCHAR(255),
  amenity_lat DECIMAL(10, 8),
  amenity_lng DECIMAL(11, 8),
  distance_meters INT,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
);

-- Geo-spatial query for nearby properties
-- Example: Find properties within 5km of a point
SELECT *, 
  (6371 * acos(
    cos(radians(:lat)) * cos(radians(latitude)) * 
    cos(radians(longitude) - radians(:lng)) + 
    sin(radians(:lat)) * sin(radians(latitude))
  )) AS distance_km
FROM properties
HAVING distance_km <= 5
ORDER BY distance_km;
```

---

## User Flow

```
┌──────────────────┐     ┌────────────────────┐
│ User enters      │────▶│ Nominatim geocodes │
│ location/city    │     │ to coordinates     │
└──────────────────┘     └─────────┬──────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │ Map displays with           │
                    │ property markers (clustered)│
                    └──────────────┬──────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ User clicks   │         │ User draws    │         │ User hovers   │
│ property      │         │ radius filter │         │ for preview   │
│ marker        │         │ on map        │         │ popup         │
└───────┬───────┘         └───────┬───────┘         └───────────────┘
        │                         │
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│ Property      │         │ Properties    │
│ detail page   │         │ filtered      │
│ with map      │         │ within radius │
└───────────────┘         └───────────────┘
```

---

## Expected Outcomes

| Metric | Target |
|--------|--------|
| Map interaction rate | 75% of users |
| Location filter usage | 60% of searches |
| Time to find relevant property | -40% reduction |
| User satisfaction with location info | 4.5/5 |

---

# Feature 3: Advanced Search & Filtering System

## Problem Statement

Generic search functions on existing platforms fail to address the diverse and specific needs of property seekers. Users waste time scrolling through irrelevant listings because filters are too basic or non-existent.

### Key Issues:
- **One-Size-Fits-All Search**: Basic price and location filters ignore lifestyle needs
- **Filter Overload vs. Filter Scarcity**: Either too many confusing options or too few useful ones
- **No Lifestyle-Based Filtering**: Cannot filter by vegetarian-friendly, pet-friendly, or gender-specific
- **Static Results**: No real-time updates as filters change
- **Poor Mobile Filter Experience**: Complex filters break on small screens
- **No Save/Reuse Filters**: Users repeat the same filter setup each visit

### Indian Market Specific Needs:
- Vegetarian/Non-vegetarian kitchen preferences
- Bachelor/Family-friendly restrictions
- Gender-specific PG/hostels
- Caste/religion-based community preferences (sensitive but real)
- Distance from specific colleges/offices
- Lease duration flexibility (6 months vs. 11 months)

---

## Solution Overview

RoomGi implements a **comprehensive yet intuitive filtering system** that balances depth with usability:

### Core Filter Categories:

1. **Location Filters**
   - City, locality, landmark
   - Distance from specific point
   - Near metro/bus station

2. **Budget Filters**
   - Price range slider
   - Include/exclude maintenance
   - Deposit range

3. **Property Type Filters**
   - Room/PG/Hostel/Flat/Home
   - Rent/Buy
   - Shared/Private

4. **Amenities Filters**
   - WiFi, AC, Parking, Laundry
   - Gym, Pool, Power backup
   - Furnished level

5. **Lifestyle Filters** (Unique to RoomGi)
   - Pet-friendly
   - Vegetarian only
   - Gender-specific
   - Bachelor-friendly
   - Couple-friendly

6. **Availability Filters**
   - Move-in date
   - Lease duration
   - Immediate availability

---

## Technical Implementation

### Filter State Management (React + URL Sync)

```javascript
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

// Custom hook for filter management
function usePropertyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse filters from URL
  const getFiltersFromURL = useCallback(() => ({
    city: searchParams.get('city') || '',
    locality: searchParams.get('locality') || '',
    minPrice: parseInt(searchParams.get('minPrice')) || 0,
    maxPrice: parseInt(searchParams.get('maxPrice')) || 100000,
    propertyType: searchParams.getAll('type') || [],
    listingType: searchParams.get('listingType') || 'rent',
    bedrooms: searchParams.getAll('bedrooms').map(Number) || [],
    furnished: searchParams.get('furnished') || '',
    amenities: searchParams.getAll('amenity') || [],
    lifestyle: {
      petFriendly: searchParams.get('petFriendly') === 'true',
      vegetarianOnly: searchParams.get('vegOnly') === 'true',
      genderPreference: searchParams.get('gender') || 'any',
      bachelorFriendly: searchParams.get('bachelor') === 'true'
    },
    availability: searchParams.get('availableFrom') || '',
    sortBy: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1
  }), [searchParams]);

  const [filters, setFilters] = useState(getFiltersFromURL);

  // Sync filters to URL
  const updateFilters = useCallback((newFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          if (v) params.set(k, v.toString());
        });
      } else if (value) {
        params.set(key, value.toString());
      }
    });
    
    setSearchParams(params);
    setFilters(newFilters);
  }, [setSearchParams]);

  return { filters, updateFilters };
}
```

### Filter Panel Component

```javascript
function FilterPanel({ filters, onFilterChange, propertyCount }) {
  const amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'ac', label: 'AC', icon: '❄️' },
    { id: 'parking', label: 'Parking', icon: '🅿️' },
    { id: 'laundry', label: 'Laundry', icon: '🧺' },
    { id: 'gym', label: 'Gym', icon: '🏋️' },
    { id: 'power_backup', label: 'Power Backup', icon: '🔋' },
    { id: 'security', label: '24/7 Security', icon: '🔒' },
    { id: 'cctv', label: 'CCTV', icon: '📹' },
    { id: 'lift', label: 'Lift', icon: '🛗' },
    { id: 'water_supply', label: '24/7 Water', icon: '💧' }
  ];

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <span className="result-count">{propertyCount} properties found</span>
        <button onClick={() => onFilterChange({})}>Clear All</button>
      </div>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <CheckboxGroup
          options={['Room', 'PG', 'Hostel', 'Flat', 'Home']}
          selected={filters.propertyType}
          onChange={(types) => onFilterChange({ ...filters, propertyType: types })}
        />
      </FilterSection>

      {/* Listing Type */}
      <FilterSection title="Looking to">
        <RadioGroup
          options={[
            { value: 'rent', label: 'Rent' },
            { value: 'buy', label: 'Buy' }
          ]}
          selected={filters.listingType}
          onChange={(type) => onFilterChange({ ...filters, listingType: type })}
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Budget">
        <PriceRangeSlider
          min={0}
          max={100000}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={([min, max]) => onFilterChange({ 
            ...filters, 
            minPrice: min, 
            maxPrice: max 
          })}
          formatLabel={(val) => `₹${val.toLocaleString()}`}
        />
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms">
        <ButtonGroup
          options={['1', '2', '3', '4', '5+']}
          selected={filters.bedrooms}
          multiSelect
          onChange={(beds) => onFilterChange({ ...filters, bedrooms: beds })}
        />
      </FilterSection>

      {/* Furnished Status */}
      <FilterSection title="Furnishing">
        <RadioGroup
          options={[
            { value: '', label: 'Any' },
            { value: 'unfurnished', label: 'Unfurnished' },
            { value: 'semi', label: 'Semi-Furnished' },
            { value: 'fully', label: 'Fully Furnished' }
          ]}
          selected={filters.furnished}
          onChange={(f) => onFilterChange({ ...filters, furnished: f })}
        />
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities" collapsible>
        <div className="amenity-grid">
          {amenitiesList.map(amenity => (
            <label key={amenity.id} className="amenity-chip">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity.id)}
                onChange={(e) => {
                  const newAmenities = e.target.checked
                    ? [...filters.amenities, amenity.id]
                    : filters.amenities.filter(a => a !== amenity.id);
                  onFilterChange({ ...filters, amenities: newAmenities });
                }}
              />
              <span>{amenity.icon} {amenity.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Lifestyle Preferences */}
      <FilterSection title="Preferences" collapsible>
        <div className="preference-toggles">
          <ToggleSwitch
            label="🐕 Pet Friendly"
            checked={filters.lifestyle.petFriendly}
            onChange={(checked) => onFilterChange({
              ...filters,
              lifestyle: { ...filters.lifestyle, petFriendly: checked }
            })}
          />
          <ToggleSwitch
            label="🥗 Vegetarian Only"
            checked={filters.lifestyle.vegetarianOnly}
            onChange={(checked) => onFilterChange({
              ...filters,
              lifestyle: { ...filters.lifestyle, vegetarianOnly: checked }
            })}
          />
          <ToggleSwitch
            label="👨‍💼 Bachelor Friendly"
            checked={filters.lifestyle.bachelorFriendly}
            onChange={(checked) => onFilterChange({
              ...filters,
              lifestyle: { ...filters.lifestyle, bachelorFriendly: checked }
            })}
          />
        </div>
        
        <div className="gender-preference">
          <label>Gender Preference</label>
          <select 
            value={filters.lifestyle.genderPreference}
            onChange={(e) => onFilterChange({
              ...filters,
              lifestyle: { ...filters.lifestyle, genderPreference: e.target.value }
            })}
          >
            <option value="any">Any</option>
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
          </select>
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <input
          type="date"
          value={filters.availability}
          onChange={(e) => onFilterChange({ ...filters, availability: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
        />
      </FilterSection>
    </aside>
  );
}
```

### Backend API for Filtered Search

```javascript
// routes/properties.js
router.get('/search', async (req, res) => {
  const {
    city, locality, minPrice, maxPrice, type, listingType,
    bedrooms, furnished, amenity, petFriendly, vegOnly,
    gender, bachelor, availableFrom, sort, page = 1, limit = 20
  } = req.query;

  // Build dynamic query
  let query = `
    SELECT p.*, 
           array_agg(DISTINCT pa.amenity) as amenities,
           COUNT(*) OVER() as total_count
    FROM properties p
    LEFT JOIN property_amenities pa ON p.id = pa.property_id
    WHERE 1=1
  `;
  
  const params = [];
  let paramIndex = 1;

  // Location filters
  if (city) {
    query += ` AND LOWER(p.city) = LOWER($${paramIndex++})`;
    params.push(city);
  }
  if (locality) {
    query += ` AND LOWER(p.address) LIKE LOWER($${paramIndex++})`;
    params.push(`%${locality}%`);
  }

  // Price filters
  if (minPrice) {
    query += ` AND p.price >= $${paramIndex++}`;
    params.push(parseInt(minPrice));
  }
  if (maxPrice) {
    query += ` AND p.price <= $${paramIndex++}`;
    params.push(parseInt(maxPrice));
  }

  // Property type (multiple)
  if (type) {
    const types = Array.isArray(type) ? type : [type];
    query += ` AND p.property_type = ANY($${paramIndex++})`;
    params.push(types);
  }

  // Listing type
  if (listingType) {
    query += ` AND p.listing_type = $${paramIndex++}`;
    params.push(listingType);
  }

  // Bedrooms (multiple)
  if (bedrooms) {
    const beds = Array.isArray(bedrooms) ? bedrooms : [bedrooms];
    query += ` AND p.bedrooms = ANY($${paramIndex++})`;
    params.push(beds.map(Number));
  }

  // Furnished status
  if (furnished) {
    query += ` AND p.furnished = $${paramIndex++}`;
    params.push(furnished);
  }

  // Lifestyle filters
  if (petFriendly === 'true') {
    query += ` AND p.pet_friendly = true`;
  }
  if (vegOnly === 'true') {
    query += ` AND p.vegetarian_only = true`;
  }
  if (gender && gender !== 'any') {
    query += ` AND (p.gender_preference = $${paramIndex++} OR p.gender_preference = 'any')`;
    params.push(gender);
  }
  if (bachelor === 'true') {
    query += ` AND p.bachelor_friendly = true`;
  }

  // Availability
  if (availableFrom) {
    query += ` AND p.available_from <= $${paramIndex++}`;
    params.push(availableFrom);
  }

  // Status filter (only show available)
  query += ` AND p.status = 'available'`;

  // Group by for aggregation
  query += ` GROUP BY p.id`;

  // Amenity filter (HAVING clause after GROUP BY)
  if (amenity) {
    const amenities = Array.isArray(amenity) ? amenity : [amenity];
    query += ` HAVING array_agg(pa.amenity) @> $${paramIndex++}`;
    params.push(amenities);
  }

  // Sorting
  const sortOptions = {
    'newest': 'p.created_at DESC',
    'oldest': 'p.created_at ASC',
    'price_low': 'p.price ASC',
    'price_high': 'p.price DESC',
    'rating': 'p.average_rating DESC NULLS LAST'
  };
  query += ` ORDER BY ${sortOptions[sort] || sortOptions['newest']}`;

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(parseInt(limit), offset);

  try {
    const result = await pool.query(query, params);
    const totalCount = result.rows[0]?.total_count || 0;
    
    res.json({
      properties: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount: parseInt(totalCount),
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});
```

---

## Database Schema Updates

```sql
-- Add lifestyle columns to properties
ALTER TABLE properties ADD COLUMN pet_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN vegetarian_only BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN gender_preference VARCHAR(20) DEFAULT 'any';
ALTER TABLE properties ADD COLUMN bachelor_friendly BOOLEAN DEFAULT TRUE;
ALTER TABLE properties ADD COLUMN couple_friendly BOOLEAN DEFAULT TRUE;
ALTER TABLE properties ADD COLUMN min_lease_months INT DEFAULT 11;
ALTER TABLE properties ADD COLUMN max_occupants INT;

-- Saved searches table
CREATE TABLE saved_searches (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  filters JSONB NOT NULL,
  notification_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_notified_at TIMESTAMP
);

-- Create indexes for common filter combinations
CREATE INDEX idx_properties_city_price ON properties(city, price);
CREATE INDEX idx_properties_type_listing ON properties(property_type, listing_type);
CREATE INDEX idx_properties_lifestyle ON properties(pet_friendly, vegetarian_only, gender_preference);
```

---

## Expected Outcomes

| Metric | Target |
|--------|--------|
| Filter usage rate | 85% of searches |
| Time to find matching property | -50% |
| Search abandonment rate | -30% |
| Saved search usage | 40% of registered users |

---

# Feature 4: User Authentication & Verification System

## Problem Statement

Trust is the foundation of any marketplace. In rental platforms, both property seekers and owners face significant trust challenges. Fake profiles, scam listings, and fraudulent users undermine the entire ecosystem.

### Key Issues:
- **Fake Owner Profiles**: Scammers post properties they don't own
- **Fraudulent Renters**: Owners fear dealing with unreliable tenants
- **No Identity Verification**: Anyone can create accounts with fake information
- **Payment Scams**: Advance payments disappear with fake owners
- **No Accountability**: Anonymous users face no consequences for bad behavior
- **Data Security**: User personal information is vulnerable

### Trust Statistics:
- 34% of online rental seekers have encountered scams (REILIA, 2022)
- 67% of property owners hesitate to list online due to trust concerns
- Platforms with verification see 3x higher conversion rates (Deloitte, 2023)

---

## Solution Overview

RoomGi implements a **multi-tier verification system** that builds trust progressively:

### Verification Levels:

| Level | Requirements | Badge | Privileges |
|-------|--------------|-------|------------|
| **Level 0** | Email only | None | Browse only |
| **Level 1** | Email + Phone OTP | 📱 | Can contact owners |
| **Level 2** | Level 1 + ID upload | ✅ | Can book/inquire |
| **Level 3** | Level 2 + Address proof | 🏆 | Priority listing, badges visible |

### For Property Owners (Additional):
- Property ownership document upload
- Physical verification option (premium)
- Bank account verification for payments

---

## Technical Implementation

### Authentication Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │
│  │   Sign Up   │──▶│   Email     │──▶│   Phone     │              │
│  │   Form      │   │   Verify    │   │   OTP       │              │
│  └─────────────┘   └─────────────┘   └──────┬──────┘              │
│                                             │                      │
│                                    ┌────────▼────────┐            │
│                                    │  Basic Account  │            │
│                                    │  (Level 1)      │            │
│                                    └────────┬────────┘            │
│                                             │                      │
│               ┌─────────────────────────────┼─────────────────────┐│
│               ▼                             ▼                     ▼│
│  ┌─────────────────┐          ┌─────────────────┐    ┌───────────┐│
│  │ ID Verification │          │ Skip for now    │    │ OAuth     ││
│  │ (Aadhaar/PAN)   │          │ (Limited access)│    │ (Google)  ││
│  └────────┬────────┘          └─────────────────┘    └───────────┘│
│           │                                                        │
│  ┌────────▼────────┐                                              │
│  │ Verified User   │                                              │
│  │ (Level 2/3)     │                                              │
│  └─────────────────┘                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Auth Framework | JWT + bcrypt | Secure token-based auth |
| OAuth | Firebase Auth / Passport.js | Google, Facebook login |
| OTP Service | Twilio / MSG91 | Phone verification |
| Email Service | SendGrid / Nodemailer | Email verification |
| ID Verification | DigiLocker API (India) | Aadhaar/PAN verification |
| 2FA | Speakeasy (TOTP) | Two-factor authentication |

### Backend Implementation

```javascript
// models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_type: {
      type: DataTypes.ENUM('renter', 'owner', 'broker', 'admin'),
      defaultValue: 'renter'
    },
    verification_level: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    id_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    id_document_url: {
      type: DataTypes.TEXT
    },
    profile_pic_url: {
      type: DataTypes.TEXT
    },
    last_login: {
      type: DataTypes.DATE
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.calculateVerificationLevel = function() {
    let level = 0;
    if (this.email_verified) level = 1;
    if (this.email_verified && this.phone_verified) level = 2;
    if (this.email_verified && this.phone_verified && this.id_verified) level = 3;
    return level;
  };

  return User;
};

// controllers/authController.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, VerificationToken } = require('../models');
const { sendVerificationEmail, sendOTP } = require('../services/notificationService');

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, userType } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      email,
      password_hash: password, // Will be hashed by hook
      name,
      phone,
      user_type: userType || 'renter'
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
      user_id: user.id,
      token: verificationToken,
      type: 'email',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate JWT (limited access until verified)
    const token = jwt.sign(
      { userId: user.id, verificationLevel: 0 },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verificationLevel: 0
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const verificationToken = await VerificationToken.findOne({
      where: { token, type: 'email' },
      include: [User]
    });

    if (!verificationToken || verificationToken.expires_at < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update user
    await User.update(
      { email_verified: true, verification_level: 1 },
      { where: { id: verificationToken.user_id } }
    );

    // Delete used token
    await verificationToken.destroy();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

exports.sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user.id;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Store OTP
    await VerificationToken.create({
      user_id: userId,
      token: otpHash,
      type: 'phone',
      expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP via SMS
    await sendOTP(phone, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyPhoneOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    const verificationToken = await VerificationToken.findOne({
      where: { user_id: userId, type: 'phone' },
      order: [['created_at', 'DESC']]
    });

    if (!verificationToken || verificationToken.expires_at < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    const isValid = await bcrypt.compare(otp, verificationToken.token);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update user
    const user = await User.findByPk(userId);
    await user.update({
      phone_verified: true,
      verification_level: user.calculateVerificationLevel()
    });

    await verificationToken.destroy();

    res.json({ 
      message: 'Phone verified successfully',
      verificationLevel: user.verification_level
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !await user.validatePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        userType: user.user_type,
        verificationLevel: user.verification_level 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        verificationLevel: user.verification_level,
        profilePic: user.profile_pic_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
```

### JWT Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.requireVerificationLevel = (minLevel) => {
  return (req, res, next) => {
    if (req.user.verificationLevel < minLevel) {
      return res.status(403).json({ 
        error: `Verification level ${minLevel} required`,
        currentLevel: req.user.verificationLevel
      });
    }
    next();
  };
};

exports.requireOwner = (req, res, next) => {
  if (req.user.userType !== 'owner' && req.user.userType !== 'broker') {
    return res.status(403).json({ error: 'Owner/broker access required' });
  }
  next();
};
```

### Frontend Auth Context

```javascript
// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then(userData => setUser(userData))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('token', response.token);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    localStorage.setItem('token', response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateVerificationLevel = (level) => {
    setUser(prev => ({ ...prev, verificationLevel: level }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateVerificationLevel,
    isAuthenticated: !!user,
    isVerified: user?.verificationLevel >= 2,
    isOwner: user?.userType === 'owner' || user?.userType === 'broker'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## Verification Badge Display

```javascript
function VerificationBadge({ level, size = 'medium' }) {
  const badges = {
    0: { icon: '⚪', label: 'Unverified', color: '#gray' },
    1: { icon: '📱', label: 'Phone Verified', color: '#3498db' },
    2: { icon: '✅', label: 'ID Verified', color: '#27ae60' },
    3: { icon: '🏆', label: 'Fully Verified', color: '#f1c40f' }
  };

  const badge = badges[level] || badges[0];

  return (
    <span 
      className={`verification-badge ${size}`}
      style={{ backgroundColor: badge.color }}
      title={badge.label}
    >
      {badge.icon} {size !== 'small' && badge.label}
    </span>
  );
}
```

---

## Database Schema

```sql
-- Verification tokens table
CREATE TABLE verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  type ENUM('email', 'phone', 'password_reset', 'id_verification') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login history (for security)
CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  location VARCHAR(100),
  success BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ID verification documents
CREATE TABLE id_documents (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type ENUM('aadhaar', 'pan', 'passport', 'driving_license'),
  document_url TEXT NOT NULL,
  verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_tokens ON verification_tokens(user_id, type);
CREATE INDEX idx_login_history ON login_history(user_id, created_at DESC);
```

---

## Expected Outcomes

| Metric | Target |
|--------|--------|
| User registration completion | 85% |
| Email verification rate | 75% |
| Phone verification rate | 60% |
| ID verification rate | 30% |
| Fraud incident reduction | -80% |
| User trust score (survey) | 4.5/5 |

---

# Feature 5: Property Listing Management (Owner Dashboard)

## Problem Statement

Property owners and brokers struggle to manage multiple listings efficiently. Traditional methods (phone calls, WhatsApp, spreadsheets) are unorganized, time-consuming, and error-prone.

### Key Issues:
- **No Centralized Management**: Listings scattered across platforms
- **Manual Status Updates**: Forgetting to mark properties as booked
- **Poor Lead Tracking**: Missing inquiries and potential tenants
- **No Performance Insights**: No idea which listings perform well
- **Tedious Repetition**: Re-entering same information for each platform
- **Image Management Hell**: Organizing photos across multiple properties

---

## Solution Overview

RoomGi provides a **comprehensive owner dashboard** for end-to-end property management:

### Dashboard Features:
1. **Property CRUD** - Add, edit, delete listings
2. **Bulk Operations** - Update multiple properties at once
3. **Inquiry Management** - View and respond to all inquiries
4. **Analytics** - Views, inquiries, conversion rates
5. **Calendar** - Availability and booking management
6. **Verification Status** - Property verification progress
7. **Payment Tracking** - Track rent payments (future)

---

## Technical Implementation

### Dashboard UI Component

```javascript
// pages/OwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ownerAPI } from '../services/api';
import PropertyTable from '../components/dashboard/PropertyTable';
import InquiryList from '../components/dashboard/InquiryList';
import AnalyticsCards from '../components/dashboard/AnalyticsCards';
import AddPropertyModal from '../components/dashboard/AddPropertyModal';

function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [propertiesRes, inquiriesRes, analyticsRes] = await Promise.all([
        ownerAPI.getMyProperties(),
        ownerAPI.getMyInquiries(),
        ownerAPI.getAnalytics()
      ]);
      setProperties(propertiesRes.data);
      setInquiries(inquiriesRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (propertyData) => {
    try {
      await ownerAPI.createProperty(propertyData);
      setShowAddModal(false);
      loadDashboardData();
    } catch (error) {
      console.error('Add property error:', error);
    }
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await ownerAPI.updatePropertyStatus(propertyId, newStatus);
      setProperties(prev => 
        prev.map(p => p.id === propertyId ? { ...p, status: newStatus } : p)
      );
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="owner-dashboard">
      <header className="dashboard-header">
        <div className="welcome">
          <h1>Welcome, {user.name}</h1>
          <p>Manage your properties and inquiries</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Property
        </button>
      </header>

      {/* Analytics Summary */}
      <AnalyticsCards data={analytics} />

      {/* Tab Navigation */}
      <nav className="dashboard-tabs">
        <button 
          className={activeTab === 'properties' ? 'active' : ''}
          onClick={() => setActiveTab('properties')}
        >
          My Properties ({properties.length})
        </button>
        <button 
          className={activeTab === 'inquiries' ? 'active' : ''}
          onClick={() => setActiveTab('inquiries')}
        >
          Inquiries ({inquiries.filter(i => i.status === 'new').length} new)
        </button>
        <button 
          className={activeTab === 'calendar' ? 'active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          Availability Calendar
        </button>
      </nav>

      {/* Tab Content */}
      <main className="dashboard-content">
        {activeTab === 'properties' && (
          <PropertyTable 
            properties={properties}
            onStatusChange={handleStatusChange}
            onEdit={(id) => navigate(`/dashboard/edit/${id}`)}
            onDelete={handleDeleteProperty}
          />
        )}

        {activeTab === 'inquiries' && (
          <InquiryList 
            inquiries={inquiries}
            onReply={handleReplyToInquiry}
            onMarkRead={handleMarkRead}
          />
        )}

        {activeTab === 'calendar' && (
          <AvailabilityCalendar 
            properties={properties}
            onAvailabilityChange={handleAvailabilityUpdate}
          />
        )}
      </main>

      {/* Add Property Modal */}
      {showAddModal && (
        <AddPropertyModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProperty}
        />
      )}
    </div>
  );
}
```

### Property Form Component

```javascript
// components/dashboard/PropertyForm.jsx
import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import ImageUploader from './ImageUploader';

const propertySchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(100),
  description: Yup.string().required('Description is required').min(50),
  propertyType: Yup.string().required('Select property type'),
  listingType: Yup.string().required('Select listing type'),
  price: Yup.number().required('Price is required').min(0),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  bedrooms: Yup.number().min(0),
  bathrooms: Yup.number().min(0),
  size: Yup.number().min(0),
  amenities: Yup.array().of(Yup.string()),
  images: Yup.array().min(3, 'Upload at least 3 images')
});

function PropertyForm({ initialValues, onSubmit, isEditing }) {
  const amenityOptions = [
    'WiFi', 'AC', 'Parking', 'Laundry', 'Gym', 'Power Backup',
    'Security', 'CCTV', 'Lift', 'Water Supply', 'Geyser', 
    'TV', 'Fridge', 'Washing Machine', 'Microwave', 'Gas Stove'
  ];

  const defaultValues = {
    title: '',
    description: '',
    propertyType: '',
    listingType: 'rent',
    price: '',
    pricePeriod: 'monthly',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    bedrooms: 1,
    bathrooms: 1,
    size: '',
    furnished: 'semi',
    amenities: [],
    petFriendly: false,
    vegetarianOnly: false,
    genderPreference: 'any',
    bachelorFriendly: true,
    availableFrom: new Date().toISOString().split('T')[0],
    images: [],
    ...initialValues
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={propertySchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form className="property-form">
          {/* Basic Information */}
          <section className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Property Title</label>
              <Field 
                name="title" 
                placeholder="e.g., Spacious 2BHK near Metro Station"
              />
              {errors.title && touched.title && (
                <span className="error">{errors.title}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Property Type</label>
                <Field as="select" name="propertyType">
                  <option value="">Select type</option>
                  <option value="room">Single Room</option>
                  <option value="pg">PG</option>
                  <option value="hostel">Hostel</option>
                  <option value="flat">Flat/Apartment</option>
                  <option value="home">Independent Home</option>
                </Field>
              </div>

              <div className="form-group">
                <label>Listing For</label>
                <Field as="select" name="listingType">
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </Field>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <Field 
                as="textarea" 
                name="description" 
                rows={5}
                placeholder="Describe your property in detail..."
              />
              <span className="char-count">
                {values.description.length}/500 characters
              </span>
            </div>
          </section>

          {/* Location */}
          <section className="form-section">
            <h3>Location</h3>
            
            <div className="form-group">
              <label>Full Address</label>
              <Field name="address" placeholder="House/Flat number, Street, Area" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <Field name="city" />
              </div>
              <div className="form-group">
                <label>State</label>
                <Field name="state" />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <Field name="postalCode" />
              </div>
            </div>

            {/* Map for location picking */}
            <LocationPicker
              value={values.location}
              onChange={(coords) => {
                setFieldValue('latitude', coords.lat);
                setFieldValue('longitude', coords.lng);
              }}
            />
          </section>

          {/* Pricing */}
          <section className="form-section">
            <h3>Pricing</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <Field type="number" name="price" min="0" />
              </div>
              <div className="form-group">
                <label>Period</label>
                <Field as="select" name="pricePeriod">
                  <option value="monthly">Per Month</option>
                  <option value="yearly">Per Year</option>
                  <option value="one-time">One Time (Sale)</option>
                </Field>
              </div>
            </div>

            <div className="form-group">
              <label>Security Deposit (₹)</label>
              <Field type="number" name="deposit" min="0" />
            </div>
          </section>

          {/* Property Details */}
          <section className="form-section">
            <h3>Property Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <Field type="number" name="bedrooms" min="0" max="10" />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <Field type="number" name="bathrooms" min="0" max="10" />
              </div>
              <div className="form-group">
                <label>Size (sq.ft)</label>
                <Field type="number" name="size" min="0" />
              </div>
            </div>

            <div className="form-group">
              <label>Furnishing</label>
              <Field as="select" name="furnished">
                <option value="unfurnished">Unfurnished</option>
                <option value="semi">Semi-Furnished</option>
                <option value="fully">Fully Furnished</option>
              </Field>
            </div>
          </section>

          {/* Amenities */}
          <section className="form-section">
            <h3>Amenities</h3>
            
            <div className="amenity-grid">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <Field 
                    type="checkbox" 
                    name="amenities" 
                    value={amenity.toLowerCase().replace(' ', '_')}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </section>

          {/* Preferences */}
          <section className="form-section">
            <h3>Tenant Preferences</h3>
            
            <div className="preference-toggles">
              <label>
                <Field type="checkbox" name="petFriendly" />
                Pet Friendly
              </label>
              <label>
                <Field type="checkbox" name="vegetarianOnly" />
                Vegetarian Only
              </label>
              <label>
                <Field type="checkbox" name="bachelorFriendly" />
                Bachelor Friendly
              </label>
            </div>

            <div className="form-group">
              <label>Gender Preference</label>
              <Field as="select" name="genderPreference">
                <option value="any">Any</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </Field>
            </div>
          </section>

          {/* Images */}
          <section className="form-section">
            <h3>Property Images</h3>
            <p className="hint">Upload at least 3 images. First image will be the cover.</p>
            
            <ImageUploader
              images={values.images}
              onChange={(images) => setFieldValue('images', images)}
              maxImages={15}
            />
            {errors.images && touched.images && (
              <span className="error">{errors.images}</span>
            )}
          </section>

          {/* Availability */}
          <section className="form-section">
            <h3>Availability</h3>
            
            <div className="form-group">
              <label>Available From</label>
              <Field type="date" name="availableFrom" />
            </div>
          </section>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" className="btn-secondary">
              Save as Draft
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : (isEditing ? 'Update Listing' : 'Publish Listing')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
```

### Backend API Routes

```javascript
// routes/owner.js
const express = require('express');
const router = express.Router();
const { authenticate, requireOwner } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ownerController = require('../controllers/ownerController');

// All routes require authentication and owner role
router.use(authenticate, requireOwner);

// Properties
router.get('/properties', ownerController.getMyProperties);
router.post('/properties', upload.array('images', 15), ownerController.createProperty);
router.get('/properties/:id', ownerController.getPropertyById);
router.put('/properties/:id', upload.array('images', 15), ownerController.updateProperty);
router.delete('/properties/:id', ownerController.deleteProperty);
router.patch('/properties/:id/status', ownerController.updateStatus);

// Inquiries
router.get('/inquiries', ownerController.getMyInquiries);
router.post('/inquiries/:id/reply', ownerController.replyToInquiry);
router.patch('/inquiries/:id/status', ownerController.updateInquiryStatus);

// Analytics
router.get('/analytics', ownerController.getAnalytics);
router.get('/analytics/property/:id', ownerController.getPropertyAnalytics);

module.exports = router;
```

---

## Expected Outcomes

| Metric | Target |
|--------|--------|
| Properties per owner | Avg 3-5 |
| Time to list a property | < 10 minutes |
| Inquiry response rate | 80% within 24h |
| Owner satisfaction | 4.5/5 |

---

# Feature 6: User Reviews & Rating System

## Problem Statement

Without reviews, users cannot assess property quality or owner reliability before committing. This creates uncertainty and risk for both parties.

### Key Issues:
- **No Social Proof**: New users have no way to trust listings
- **No Accountability**: Bad owners/properties go unreported
- **Subjective Descriptions**: Owners oversell; reality disappoints
- **Repeat Mistakes**: Same problems affect multiple users

---

## Solution Overview

RoomGi implements a **comprehensive review system** with:
- 5-star ratings across multiple categories
- Text reviews with photo uploads
- Verified stay badges
- Owner response capability
- Review moderation

### Rating Categories:
1. **Overall Experience** (mandatory)
2. **Accuracy** (listing vs. reality)
3. **Cleanliness**
4. **Location**
5. **Value for Money**
6. **Communication** (with owner)

---

## Technical Implementation

### Review Component

```javascript
// components/reviews/ReviewForm.jsx
function ReviewForm({ propertyId, onSubmit }) {
  const [ratings, setRatings] = useState({
    overall: 0,
    accuracy: 0,
    cleanliness: 0,
    location: 0,
    value: 0,
    communication: 0
  });
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ratings.overall === 0) {
      alert('Please provide an overall rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ propertyId, ratings, comment, photos });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Leave a Review</h3>

      {/* Rating categories */}
      {Object.entries(ratings).map(([category, value]) => (
        <div key={category} className="rating-category">
          <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
          <StarRating
            value={value}
            onChange={(newValue) => setRatings(prev => ({ 
              ...prev, 
              [category]: newValue 
            }))}
          />
        </div>
      ))}

      {/* Comment */}
      <div className="form-group">
        <label>Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={5}
          minLength={50}
          required
        />
        <span className="char-count">{comment.length}/500</span>
      </div>

      {/* Photo upload */}
      <div className="form-group">
        <label>Add Photos (optional)</label>
        <ImageUploader
          images={photos}
          onChange={setPhotos}
          maxImages={5}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

// Star Rating Component
function StarRating({ value, onChange, readonly = false }) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${(hoverValue || value) >= star ? 'filled' : ''}`}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          ★
        </span>
      ))}
      <span className="rating-text">
        {value > 0 ? `${value}/5` : 'Select rating'}
      </span>
    </div>
  );
}
```

### Database Schema

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reviewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Ratings (1-5)
  rating_overall INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_accuracy INT CHECK (rating_accuracy BETWEEN 1 AND 5),
  rating_cleanliness INT CHECK (rating_cleanliness BETWEEN 1 AND 5),
  rating_location INT CHECK (rating_location BETWEEN 1 AND 5),
  rating_value INT CHECK (rating_value BETWEEN 1 AND 5),
  rating_communication INT CHECK (rating_communication BETWEEN 1 AND 5),
  
  comment TEXT NOT NULL,
  photos TEXT[],
  
  -- Verification
  verified_stay BOOLEAN DEFAULT FALSE,
  stay_duration_months INT,
  
  -- Moderation
  status ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'pending',
  moderation_note TEXT,
  
  -- Owner response
  owner_response TEXT,
  owner_responded_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(property_id, reviewer_id)
);

-- Computed average rating view
CREATE VIEW property_ratings AS
SELECT 
  property_id,
  COUNT(*) as review_count,
  ROUND(AVG(rating_overall), 1) as avg_overall,
  ROUND(AVG(rating_accuracy), 1) as avg_accuracy,
  ROUND(AVG(rating_cleanliness), 1) as avg_cleanliness,
  ROUND(AVG(rating_location), 1) as avg_location,
  ROUND(AVG(rating_value), 1) as avg_value,
  ROUND(AVG(rating_communication), 1) as avg_communication
FROM reviews
WHERE status = 'approved'
GROUP BY property_id;
```

---

## Expected Outcomes

| Metric | Target |
|--------|--------|
| Review submission rate | 30% of completed stays |
| Average review length | 100+ characters |
| Photos per review | 1-2 average |
| Review-influenced bookings | 60% |

---

# Feature 7: Smart Price Prediction & Comparison

## Problem Statement

Users don't know if a listed price is fair. Owners struggle to price competitively. This creates friction and missed opportunities.

### Key Issues:
- **Price Uncertainty**: Is ₹10,000 fair for this area?
- **Overpricing**: Listings sit unsold due to unrealistic prices
- **Underpricing**: Owners lose potential revenue
- **No Market Context**: No benchmark to compare against

---

## Solution Overview

RoomGi implements a **price intelligence system**:
1. **Fair Price Indicator**: Shows if listing is below/at/above market
2. **Price Predictor for Owners**: Suggest optimal price based on features
3. **Price Comparison**: Compare with similar properties
4. **Price History**: Track price trends in an area

---

## Technical Implementation

### Simple Price Prediction Model

```python
# scripts/price_prediction.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

def train_price_model(data_path):
    # Load historical property data
    df = pd.read_csv(data_path)
    
    # Feature engineering
    features = [
        'city_encoded', 'property_type_encoded', 'bedrooms', 
        'bathrooms', 'size_sqft', 'furnished_encoded',
        'amenity_count', 'distance_to_center_km'
    ]
    
    X = df[features]
    y = df['price']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    score = model.score(X_test, y_test)
    print(f"Model R² Score: {score:.2f}")
    
    # Save model
    joblib.dump(model, 'models/price_predictor.joblib')
    return model

def predict_price(property_features):
    model = joblib.load('models/price_predictor.joblib')
    prediction = model.predict([property_features])[0]
    return {
        'predicted_price': round(prediction),
        'price_range': {
            'low': round(prediction * 0.85),
            'high': round(prediction * 1.15)
        }
    }
```

### Price Comparison API

```javascript
// controllers/priceController.js
exports.getPriceComparison = async (req, res) => {
  const { propertyId } = req.params;
  
  // Get target property
  const property = await Property.findByPk(propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  // Find similar properties
  const similarProperties = await Property.findAll({
    where: {
      city: property.city,
      property_type: property.property_type,
      bedrooms: { [Op.between]: [property.bedrooms - 1, property.bedrooms + 1] },
      id: { [Op.ne]: propertyId }
    },
    limit: 10,
    order: [['created_at', 'DESC']]
  });

  // Calculate statistics
  const prices = similarProperties.map(p => p.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Determine price positioning
  let pricePosition;
  if (property.price < avgPrice * 0.9) pricePosition = 'below_market';
  else if (property.price > avgPrice * 1.1) pricePosition = 'above_market';
  else pricePosition = 'at_market';

  res.json({
    currentPrice: property.price,
    marketAnalysis: {
      averagePrice: Math.round(avgPrice),
      minPrice,
      maxPrice,
      pricePosition,
      percentDifference: Math.round(((property.price - avgPrice) / avgPrice) * 100)
    },
    similarProperties: similarProperties.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      bedrooms: p.bedrooms,
      size: p.size
    }))
  });
};
```

### Frontend Price Indicator

```javascript
function PriceIndicator({ priceData }) {
  const { currentPrice, marketAnalysis } = priceData;
  const { pricePosition, percentDifference, averagePrice } = marketAnalysis;

  const indicators = {
    below_market: { 
      color: '#27ae60', 
      icon: '✓', 
      label: 'Good Deal',
      message: `${Math.abs(percentDifference)}% below market average`
    },
    at_market: { 
      color: '#f39c12', 
      icon: '~', 
      label: 'Fair Price',
      message: 'At market rate'
    },
    above_market: { 
      color: '#e74c3c', 
      icon: '↑', 
      label: 'Above Market',
      message: `${percentDifference}% above market average`
    }
  };

  const indicator = indicators[pricePosition];

  return (
    <div className="price-indicator" style={{ borderColor: indicator.color }}>
      <div className="indicator-badge" style={{ backgroundColor: indicator.color }}>
        <span className="icon">{indicator.icon}</span>
        <span className="label">{indicator.label}</span>
      </div>
      <p className="message">{indicator.message}</p>
      <p className="comparison">
        Market Avg: ₹{averagePrice.toLocaleString()}/month
      </p>
    </div>
  );
}
```

---

## Expected Outcomes

| Metric | Target |
|--------|--------|
| Price prediction accuracy | 85% within 15% range |
| User trust in pricing | +40% |
| Listing time reduction | -30% |

---

# Feature 8: Real-Time Messaging & Inquiry System

## Problem Statement

Communication between property seekers and owners is fragmented across WhatsApp, calls, and emails. This leads to missed inquiries, slow responses, and poor user experience.

---

## Solution Overview

RoomGi provides an **in-app messaging system**:
- Direct messaging between users and owners
- Message templates for common inquiries
- Read receipts and response time tracking
- Push notifications
- Message history preservation

---

## Technical Implementation

### Database Schema

```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id),
  renter_id INT NOT NULL REFERENCES users(id),
  owner_id INT NOT NULL REFERENCES users(id),
  status ENUM('active', 'closed', 'blocked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(property_id, renter_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  message_type ENUM('text', 'image', 'system') DEFAULT 'text',
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
```

### Messaging Component

```javascript
function ChatWindow({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    // Set up real-time subscription (Socket.io or polling)
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const loadMessages = async () => {
    const data = await messagesAPI.getMessages(conversationId);
    setMessages(data);
    scrollToBottom();
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await messagesAPI.send(conversationId, newMessage);
    setNewMessage('');
    loadMessages();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
          >
            <p>{msg.content}</p>
            <span className="time">
              {new Date(msg.created_at).toLocaleTimeString()}
              {msg.sender_id === user.id && (
                <span className="status">{msg.read_at ? '✓✓' : '✓'}</span>
              )}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
```

---

# Feature 9: Wishlist & Favorites System

## Problem Statement

Users browse many properties but lose track of interesting ones. They need a way to save and compare favorites.

---

## Solution Overview

Simple wishlist functionality:
- Save properties with one click
- Organize into custom lists
- Compare saved properties side-by-side
- Get notified of price changes

---

## Technical Implementation

```javascript
// Wishlist hook
function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    const data = await wishlistAPI.getAll();
    setWishlist(data);
  };

  const addToWishlist = async (propertyId) => {
    await wishlistAPI.add(propertyId);
    loadWishlist();
  };

  const removeFromWishlist = async (propertyId) => {
    await wishlistAPI.remove(propertyId);
    loadWishlist();
  };

  const isInWishlist = (propertyId) => {
    return wishlist.some(w => w.property_id === propertyId);
  };

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist };
}

// Wishlist button component
function WishlistButton({ propertyId }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(propertyId);

  return (
    <button 
      className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
      onClick={() => inWishlist ? removeFromWishlist(propertyId) : addToWishlist(propertyId)}
    >
      {inWishlist ? '❤️' : '🤍'}
    </button>
  );
}
```

---

# Feature 10: Analytics Dashboard for Owners

## Problem Statement

Owners have no visibility into how their listings perform. They can't optimize pricing or presentation without data.

---

## Solution Overview

Provide actionable analytics:
- Views per listing
- Inquiry conversion rate
- Response time metrics
- Price comparison
- Trend graphs

---

## Technical Implementation

```javascript
function AnalyticsDashboard({ ownerId }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    analyticsAPI.getOwnerStats().then(setAnalytics);
  }, []);

  if (!analytics) return <Loading />;

  return (
    <div className="analytics-dashboard">
      {/* Summary Cards */}
      <div className="stats-grid">
        <StatCard 
          title="Total Views" 
          value={analytics.totalViews}
          trend={analytics.viewsTrend}
        />
        <StatCard 
          title="Total Inquiries" 
          value={analytics.totalInquiries}
          trend={analytics.inquiriesTrend}
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${analytics.conversionRate}%`}
        />
        <StatCard 
          title="Avg Response Time" 
          value={`${analytics.avgResponseTime}h`}
        />
      </div>

      {/* Views Chart */}
      <div className="chart-section">
        <h3>Views Over Time</h3>
        <LineChart data={analytics.viewsTimeline} />
      </div>

      {/* Top Performing Properties */}
      <div className="top-properties">
        <h3>Top Performing Listings</h3>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Views</th>
              <th>Inquiries</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            {analytics.topProperties.map(prop => (
              <tr key={prop.id}>
                <td>{prop.title}</td>
                <td>{prop.views}</td>
                <td>{prop.inquiries}</td>
                <td>{prop.conversionRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

# Feature 11: Responsive Mobile-First Design

## Problem Statement

78% of property searches happen on mobile devices (NAR, 2023). Desktop-first designs break on small screens.

---

## Solution Overview

Mobile-first responsive design using Tailwind CSS:
- Fluid layouts
- Touch-friendly buttons
- Collapsible filters
- Swipe gestures for images
- Bottom navigation on mobile

---

## Technical Implementation

```css
/* Tailwind configuration */
/* tailwind.config.js */
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  }
}

/* Mobile-first component styling */
.property-grid {
  @apply grid gap-4;
  @apply grid-cols-1;          /* Mobile: 1 column */
  @apply sm:grid-cols-2;       /* Tablet: 2 columns */
  @apply lg:grid-cols-3;       /* Desktop: 3 columns */
  @apply xl:grid-cols-4;       /* Large: 4 columns */
}

.filter-panel {
  @apply fixed inset-0 z-50;   /* Mobile: Full screen overlay */
  @apply lg:relative lg:inset-auto; /* Desktop: Sidebar */
  @apply lg:w-72;
}
```

---

# Feature 12: Fraud Detection & Listing Verification

## Problem Statement

Fake listings waste user time and erode platform trust. Scammers reuse photos and post unrealistic prices.

---

## Solution Overview

Multi-layer fraud detection:
1. **Duplicate Image Detection**: Reverse image search
2. **Price Anomaly Detection**: Flag unrealistic prices
3. **Phone Verification**: Confirm owner identity
4. **Manual Review Queue**: Suspicious listings flagged for review
5. **User Reports**: Community-driven flagging

---

## Technical Implementation

```javascript
// Fraud detection service
async function analyzeListingForFraud(listing) {
  const flags = [];
  const score = 100; // Start with perfect score

  // 1. Check for duplicate images
  const duplicateImages = await checkDuplicateImages(listing.images);
  if (duplicateImages.found) {
    flags.push('duplicate_images');
    score -= 30;
  }

  // 2. Price anomaly detection
  const marketAvg = await getMarketAverage(listing.city, listing.property_type);
  if (listing.price < marketAvg * 0.5) {
    flags.push('price_too_low');
    score -= 20;
  }

  // 3. Check for suspicious patterns
  const ownerListings = await getOwnerListingCount(listing.owner_id);
  if (ownerListings > 50) {
    flags.push('excessive_listings');
    score -= 15;
  }

  // 4. Text analysis for spam keywords
  const spamScore = analyzeTextForSpam(listing.description);
  if (spamScore > 0.7) {
    flags.push('spam_content');
    score -= 25;
  }

  return {
    score,
    flags,
    needsManualReview: score < 70,
    autoReject: score < 40
  };
}
```

---

# Research References

| # | Topic | Paper Title | Google Scholar Link | Application |
|---|-------|-------------|-------------------|-------------|
| 1 | Price Prediction | Machine Learning for Real Estate Price Prediction | [Search](https://scholar.google.com/scholar?q=machine+learning+real+estate+price+prediction) | Smart price predictor |
| 2 | Trust Systems | Reputation Systems in E-Commerce Marketplaces | [Search](https://scholar.google.com/scholar?q=trust+systems+online+marketplaces) | Verification badges |
| 3 | Recommendations | Collaborative Filtering in Real Estate | [Search](https://scholar.google.com/scholar?q=recommendation+systems+real+estate) | Similar properties |
| 4 | Geospatial | Location Intelligence in Property Valuation | [Search](https://scholar.google.com/scholar?q=geospatial+analysis+property+valuation) | Nearby amenities |
| 5 | Image Processing | Real Estate Photo Recognition | [Search](https://scholar.google.com/scholar?q=computer+vision+real+estate+image+recognition) | Auto room detection |
| 6 | User Behavior | Search Behavior in Rental Marketplaces | [Search](https://scholar.google.com/scholar?q=user+behavior+rental+marketplaces) | UX optimization |
| 7 | Fraud Detection | Fraudulent Listings in Rental Marketplaces | [Search](https://scholar.google.com/scholar?q=fraud+detection+real+estate+listings) | Listing verification |
| 8 | Virtual Tours | 3D Virtual Tours in Real Estate (Zhang & Troncoso, 2023) | [Search](https://scholar.google.com/scholar?q=3D+virtual+tours+real+estate+marketing) | 360° views |
| 9 | User Reviews | Online Reviews Decision Making (Ji et al., 2022) | [Search](https://scholar.google.com/scholar?q=online+reviews+rental+platform+decision+making) | Review system |
| 10 | Sharing Economy Trust | Trust in Sharing Economy (Hawlitschek et al., 2016) | [Search](https://scholar.google.com/scholar?q=trust+sharing+economy+platforms) | Trust building |

---

## Summary

This document covers 12 comprehensive features for the RoomGi platform:

1. **Virtual Tours** - 360° property exploration
2. **Map Integration** - Location context & amenities
3. **Advanced Filters** - Lifestyle-based search
4. **Authentication** - Multi-tier verification
5. **Owner Dashboard** - Property management
6. **Reviews & Ratings** - Social proof
7. **Price Intelligence** - Fair pricing
8. **Messaging** - In-app communication
9. **Wishlist** - Save favorites
10. **Analytics** - Performance insights
11. **Responsive Design** - Mobile-first
12. **Fraud Detection** - Trust & safety

Each feature is designed to solve real problems faced by property seekers and owners, with practical implementation guidance.

---

*Last Updated: January 28, 2026*  
*RoomGi - Making Property Discovery Transparent*
