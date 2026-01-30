import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import './PropertyMap.css';
import StreetViewModal from './StreetViewModal';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom property marker icon
const createPropertyIcon = (price) => {
    const formattedPrice = price >= 10000000
        ? `₹${(price / 10000000).toFixed(1)}Cr`
        : price >= 100000
            ? `₹${(price / 100000).toFixed(0)}L`
            : `₹${(price / 1000).toFixed(0)}K`;

    return L.divIcon({
        className: 'custom-property-marker',
        html: `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 6px 10px;
                border-radius: 20px;
                font-weight: 700;
                font-size: 12px;
                white-space: nowrap;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
                border: 2px solid white;
            ">${formattedPrice}</div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 30],
    });
};

// Amenity icons configuration
const amenityIcons = {
    school: { label: 'S', color: '#4ade80', name: 'Schools' },
    hospital: { label: 'H', color: '#f87171', name: 'Hospitals' },
    pharmacy: { label: 'Rx', color: '#fb7185', name: 'Pharmacy' },
    supermarket: { label: 'M', color: '#fbbf24', name: 'Supermarket' },
    restaurant: { label: 'R', color: '#f472b6', name: 'Restaurants' },
    bank: { label: 'B', color: '#60a5fa', name: 'Banks' },
    bus_station: { label: 'BS', color: '#34d399', name: 'Bus Stop' },
    subway_entrance: { label: 'M', color: '#818cf8', name: 'Metro' },
};

const createAmenityIcon = (type) => {
    const config = amenityIcons[type] || { label: '•', color: '#888' };
    return L.divIcon({
        className: 'custom-amenity-marker',
        html: `
            <div style="
                background: ${config.color};
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 600;
                color: #fff;
                border: 2px solid #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                letter-spacing: -0.5px;
            ">${config.label}</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

function PropertyMap({
    properties = [],
    center = [20.5937, 78.9629], // Default: India center
    zoom = 5,
    onPropertyClick,
    showAmenities = false,
    radiusKm = 0,
    onRadiusChange,
    selectedPropertyId = null
}) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef(null);
    const amenitiesLayerRef = useRef(null);
    const radiusCircleRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [showStreetView, setShowStreetView] = useState(false);
    const [streetViewData, setStreetViewData] = useState({ lat: 0, lng: 0, title: '' });

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        mapInstanceRef.current = L.map(mapRef.current, {
            center: center,
            zoom: zoom,
            zoomControl: false,
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Add zoom control to bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

        // Initialize marker cluster group
        markersRef.current = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            iconCreateFunction: (cluster) => {
                const count = cluster.getChildCount();
                let size = 'small';
                if (count > 10) size = 'medium';
                if (count > 50) size = 'large';
                return L.divIcon({
                    html: `<div style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 14px;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
                        border: 3px solid white;
                    ">${count}</div>`,
                    className: `marker-cluster marker-cluster-${size}`,
                    iconSize: L.point(40, 40),
                });
            },
        });

        mapInstanceRef.current.addLayer(markersRef.current);

        // Initialize amenities layer
        amenitiesLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when properties change
    useEffect(() => {
        if (!markersRef.current) return;

        markersRef.current.clearLayers();

        const validProperties = properties.filter(p => p.latitude && p.longitude);

        if (validProperties.length === 0) return;

        const bounds = L.latLngBounds();

        validProperties.forEach(property => {
            const lat = parseFloat(property.latitude);
            const lng = parseFloat(property.longitude);

            if (isNaN(lat) || isNaN(lng)) return;

            const marker = L.marker([lat, lng], {
                icon: createPropertyIcon(property.price),
            });

            // Create popup content
            const popupContent = `
                <div class="map-popup">
                    <img 
                        class="map-popup-image" 
                        src="${property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}" 
                        alt="${property.title}"
                        onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'"
                    />
                    <div class="map-popup-content">
                        <div class="map-popup-price">
                            ${property.price >= 10000000
                    ? `₹${(property.price / 10000000).toFixed(2)} Cr`
                    : `₹${(property.price / 100000).toFixed(2)} L`}
                        </div>
                        <div class="map-popup-title">${property.title}</div>
                        <div class="map-popup-location">${property.locality || ''}, ${property.city}</div>
                        <div class="map-popup-meta">
                            ${property.bedrooms ? `<span>${property.bedrooms} Bed</span>` : ''}
                            ${property.bathrooms ? `<span>${property.bathrooms} Bath</span>` : ''}
                            ${property.size ? `<span>${property.size} sqft</span>` : ''}
                        </div>
                        <div class="map-popup-actions">
                            <button class="map-popup-btn" onclick="window.viewProperty(${property.id})">
                                View Details
                            </button>
                            <button class="map-popup-btn street-view-btn" onclick="window.openStreetView(${lat}, ${lng}, '${property.title.replace(/'/g, "\\'")}')">
                                Street View
                            </button>
                        </div>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup',
            });

            marker.on('click', () => {
                if (onPropertyClick) {
                    // Don't call immediately, let popup open first
                }
            });

            markersRef.current.addLayer(marker);
            bounds.extend([lat, lng]);
        });

        // Fit map to bounds
        if (validProperties.length > 0 && mapInstanceRef.current) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }

        // Set up global functions for popup buttons
        window.viewProperty = (id) => {
            if (onPropertyClick) onPropertyClick(id);
        };

        window.openStreetView = (lat, lng, title) => {
            setStreetViewData({ lat, lng, title });
            setShowStreetView(true);
        };

        return () => {
            delete window.viewProperty;
            delete window.openStreetView;
        };
    }, [properties, onPropertyClick]);

    // Fetch and display nearby amenities
    useEffect(() => {
        if (!showAmenities || !mapInstanceRef.current) return;

        const fetchAmenities = async () => {
            const mapCenter = mapInstanceRef.current.getCenter();
            const radius = radiusKm > 0 ? radiusKm * 1000 : 2000;

            setLoading(true);

            const amenityTypes = ['school', 'hospital', 'pharmacy', 'supermarket', 'restaurant', 'bank', 'bus_station', 'subway_entrance'];

            const query = `
                [out:json][timeout:25];
                (
                    ${amenityTypes.map(type => `
                        node["amenity"="${type}"](around:${radius},${mapCenter.lat},${mapCenter.lng});
                    `).join('')}
                );
                out body;
            `;

            try {
                const response = await fetch('https://overpass-api.de/api/interpreter', {
                    method: 'POST',
                    body: query,
                });
                const data = await response.json();
                setAmenities(data.elements || []);

                // Clear and add amenity markers
                amenitiesLayerRef.current.clearLayers();

                data.elements?.forEach(amenity => {
                    if (!amenity.lat || !amenity.lon) return;

                    const marker = L.marker([amenity.lat, amenity.lon], {
                        icon: createAmenityIcon(amenity.tags?.amenity),
                    });

                    marker.bindPopup(`
                        <div style="padding: 8px; color: #1a1a2e;">
                            <strong>${amenity.tags?.name || amenity.tags?.amenity || 'Place'}</strong>
                            <br/>
                            <small style="color: #666;">${amenityIcons[amenity.tags?.amenity]?.label || 'Amenity'}</small>
                        </div>
                    `);

                    amenitiesLayerRef.current.addLayer(marker);
                });
            } catch (error) {
                console.error('Error fetching amenities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAmenities();
    }, [showAmenities, radiusKm]);

    // Draw radius circle
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Remove existing circle
        if (radiusCircleRef.current) {
            mapInstanceRef.current.removeLayer(radiusCircleRef.current);
            radiusCircleRef.current = null;
        }

        if (radiusKm > 0) {
            const center = mapInstanceRef.current.getCenter();
            radiusCircleRef.current = L.circle([center.lat, center.lng], {
                radius: radiusKm * 1000,
                color: '#667eea',
                fillColor: '#667eea',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '10, 10',
            }).addTo(mapInstanceRef.current);
        }
    }, [radiusKm]);

    // Pan to selected property
    useEffect(() => {
        if (!selectedPropertyId || !mapInstanceRef.current || !properties.length) return;

        const property = properties.find(p => p.id === selectedPropertyId);
        if (property?.latitude && property?.longitude) {
            mapInstanceRef.current.setView(
                [parseFloat(property.latitude), parseFloat(property.longitude)],
                16,
                { animate: true }
            );
        }
    }, [selectedPropertyId, properties]);

    return (
        <div className="property-map-container">
            {loading && (
                <div className="map-loading">
                    <div className="map-loading-spinner"></div>
                    <span>Loading amenities...</span>
                </div>
            )}

            <div ref={mapRef} className="property-map"></div>

            {showAmenities && amenities.length > 0 && (
                <div className="amenities-legend">
                    <h4>Nearby Amenities</h4>
                    <div className="legend-items">
                        {Object.entries(amenityIcons).slice(0, 5).map(([key, config]) => (
                            <div key={key} className="legend-item">
                                <span className={`legend-icon ${key}`}>{config.emoji}</span>
                                <span>{config.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {onRadiusChange && (
                <div className="radius-filter">
                    <h4>Search Radius</h4>
                    <input
                        type="range"
                        className="radius-slider"
                        min="0"
                        max="10"
                        step="0.5"
                        value={radiusKm}
                        onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
                    />
                    <div className="radius-value">
                        {radiusKm > 0 ? `${radiusKm} km` : 'No limit'}
                    </div>
                </div>
            )}

            {/* Street View Modal */}
            {showStreetView && (
                <StreetViewModal
                    latitude={streetViewData.lat}
                    longitude={streetViewData.lng}
                    propertyTitle={streetViewData.title}
                    onClose={() => setShowStreetView(false)}
                />
            )}
        </div>
    );
}

export default PropertyMap;
