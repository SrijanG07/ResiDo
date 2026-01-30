import React, { useEffect, useState } from 'react';
import './StreetViewModal.css';

function StreetViewModal({ latitude, longitude, onClose, propertyTitle }) {
    const [loading, setLoading] = useState(true);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Simple Google Maps embed with Street View layer - works without API key
    // This opens an interactive map centered on the location with Street View available
    const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=18&layer=c&cbll=${latitude},${longitude}&cbp=12,0,0,0,0&output=embed`;

    // Direct link for "Open in Maps"
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}&layer=c`;

    return (
        <div className="street-view-overlay" onClick={onClose}>
            <div className="street-view-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="street-view-header">
                    <div className="street-view-title">
                        <span className="street-view-icon">SV</span>
                        <span>Street View{propertyTitle ? ` - ${propertyTitle}` : ''}</span>
                    </div>
                    <button className="street-view-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="street-view-content">
                    {loading && (
                        <div className="street-view-loading">
                            <div className="street-view-spinner"></div>
                            <p>Loading Street View...</p>
                        </div>
                    )}

                    <iframe
                        className="street-view-iframe"
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="eager"
                        referrerPolicy="no-referrer-when-downgrade"
                        onLoad={() => setLoading(false)}
                        title="Google Street View"
                    />
                </div>

                {/* Footer info */}
                <div className="street-view-footer">
                    <span className="street-view-hint">
                        Click & drag to look around • Double-click to move
                    </span>
                    <div className="street-view-actions">
                        <a
                            className="open-in-maps"
                            href={mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open in Google Maps ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StreetViewModal;
