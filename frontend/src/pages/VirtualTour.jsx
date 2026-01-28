import React, { useState, useRef, useEffect } from 'react';
import Marzipano from 'marzipano';
import './VirtualTour.css';

// 360° Panorama images from Poly Haven (equirectangular, CC0 license)
const ROOMS = [
    {
        id: 'living',
        name: 'Living Room',
        image: '/panoramas/living_room.jpg',
        description: 'Bright and airy living space with natural sunlight'
    },
    {
        id: 'lounge',
        name: 'Lounge',
        image: '/panoramas/lounge.jpg',
        description: 'Cozy lounge area with warm ambiance'
    },
    {
        id: 'kitchen',
        name: 'Kitchen & Dining',
        image: '/panoramas/kitchen.jpg',
        description: 'Open-plan kitchen with rustic charm'
    },
    {
        id: 'master-bedroom',
        name: 'Master Bedroom',
        image: '/panoramas/master_bedroom.jpg',
        description: 'Spacious master suite with ensuite access'
    },
    {
        id: 'bedroom',
        name: 'Guest Bedroom',
        image: '/panoramas/bedroom.jpg',
        description: 'Modern guest room with scenic views'
    },
    {
        id: 'bathroom',
        name: 'Bathroom',
        image: '/panoramas/bathroom.jpg',
        description: 'Contemporary bathroom with premium fixtures'
    },
    {
        id: 'study',
        name: 'Study Room',
        image: '/panoramas/study_room.jpg',
        description: 'Elegant reading room with classic architecture'
    }
];

// Marzipano 360 Panorama Viewer Component
function MarzipanoViewer({ imageUrl, roomName }) {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up previous viewer
        if (viewerRef.current) {
            viewerRef.current.destroy();
            viewerRef.current = null;
        }

        setIsLoading(true);

        // Create Marzipano viewer
        const viewer = new Marzipano.Viewer(containerRef.current, {
            controls: {
                mouseViewMode: 'drag'
            }
        });
        viewerRef.current = viewer;

        // Create equirectangular geometry for 360° panorama
        const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

        // Limit view parameters - wider FOV for realistic tour
        const limiter = Marzipano.RectilinearView.limit.traditional(
            4096,           // Max resolution
            120 * Math.PI / 180  // Max FOV (120 degrees for wider view)
        );

        // Create the view - start zoomed out for full room overview
        const view = new Marzipano.RectilinearView(
            { yaw: 0, pitch: 0, fov: 100 * Math.PI / 180 }, // Initial view (100° FOV - zoomed out)
            limiter
        );

        // Create image source
        const source = Marzipano.ImageUrlSource.fromString(imageUrl);

        // Create scene
        const scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
        });

        // Switch to scene
        scene.switchTo({
            transitionDuration: 400
        });

        // Handle loading
        const img = new Image();
        img.onload = () => setIsLoading(false);
        img.onerror = () => setIsLoading(false);
        img.src = imageUrl;

        // Cleanup on unmount or image change
        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, [imageUrl]);

    // Zoom controls
    const handleZoomIn = () => {
        if (!viewerRef.current) return;
        const view = viewerRef.current.view();
        const fov = view.fov();
        view.setFov(Math.max(fov - 0.2, 0.5));
    };

    const handleZoomOut = () => {
        if (!viewerRef.current) return;
        const view = viewerRef.current.view();
        const fov = view.fov();
        view.setFov(Math.min(fov + 0.2, 2.0));
    };

    return (
        <div className="panorama-viewer-container">
            {isLoading && (
                <div className="panorama-loading">
                    <div className="loader"></div>
                    <p>Loading {roomName}...</p>
                </div>
            )}

            <div
                ref={containerRef}
                className="marzipano-viewer"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Room indicator */}
            <div className="panorama-room-badge">
                📍 {roomName}
            </div>

            {/* Controls hint */}
            <div className="panorama-controls-hint">
                <span>🖱️ Drag to look around</span>
                <span>🔍 Scroll to zoom</span>
            </div>

            {/* Zoom controls */}
            <div className="panorama-zoom-controls">
                <button onClick={handleZoomIn}>+</button>
                <button onClick={handleZoomOut}>−</button>
            </div>
        </div>
    );
}

// Main Tour Component
function VirtualTour({ onBack }) {
    const [currentRoom, setCurrentRoom] = useState(ROOMS[0]);
    const [showIntro, setShowIntro] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleRoomChange = (room) => {
        if (room.id === currentRoom.id) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentRoom(room);
            setIsTransitioning(false);
        }, 200);
    };

    // Intro/Landing screen
    if (showIntro) {
        return (
            <div className="virtual-tour-intro">
                <button className="back-btn" onClick={onBack}>
                    ← Back to Home
                </button>

                <div className="featured-property">
                    <div className="featured-badge">🏠 360° Virtual Tour</div>
                    <h1>Luxury 3BHK Apartment</h1>
                    <p className="featured-location">📍 Koramangala, Bangalore</p>

                    <div className="featured-image">
                        <img src={ROOMS[0].image} alt="Apartment Preview" />
                        <div className="image-overlay">
                            <span>7 Rooms • Immersive 360° View</span>
                        </div>
                    </div>

                    <div className="featured-stats">
                        <div className="stat"><span>3</span>Bedrooms</div>
                        <div className="stat"><span>2</span>Bathrooms</div>
                        <div className="stat"><span>1,850</span>Sq Ft</div>
                        <div className="stat"><span>₹1.2</span>Crore</div>
                    </div>

                    <button className="btn-start" onClick={() => setShowIntro(false)}>
                        🚪 Start Virtual Tour
                    </button>

                    <p className="tour-hint">
                        Drag to look around • Click rooms below to navigate
                    </p>

                    <div className="rooms-preview">
                        <h3>Rooms You'll Explore</h3>
                        <div className="rooms-grid">
                            {ROOMS.map(room => (
                                <div key={room.id} className="room-preview">
                                    <img src={room.image} alt={room.name} />
                                    <span>{room.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main 360 Tour View
    return (
        <div className="virtual-tour-main">
            {/* Header */}
            <div className="tour-header">
                <button className="back-btn" onClick={onBack}>
                    ← Exit Tour
                </button>
                <div className="tour-title">
                    <h2>360° Virtual Tour</h2>
                    <span className="current-room">{currentRoom.name}</span>
                </div>
                <div className="tour-info">
                    Luxury 3BHK • Koramangala
                </div>
            </div>

            {/* Marzipano Panorama Viewer */}
            <div className="panorama-wrapper">
                {isTransitioning && (
                    <div className="panorama-loading">
                        <div className="loader"></div>
                        <p>Loading {currentRoom.name}...</p>
                    </div>
                )}
                <MarzipanoViewer
                    key={currentRoom.id}
                    imageUrl={currentRoom.image}
                    roomName={currentRoom.name}
                />
            </div>

            {/* Room Navigation Sidebar */}
            <div className="room-nav">
                <h3>Navigate Rooms</h3>
                <div className="room-buttons">
                    {ROOMS.map((room, index) => (
                        <button
                            key={room.id}
                            className={`room-btn ${currentRoom.id === room.id ? 'active' : ''}`}
                            onClick={() => handleRoomChange(room)}
                        >
                            <span className="room-number">{index + 1}</span>
                            <span className="room-name">{room.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Room Description */}
            <div className="room-description">
                <p>{currentRoom.description}</p>
            </div>

            {/* Mini Floor Plan */}
            <div className="floor-plan">
                <div className="floor-plan-title">Floor Plan</div>
                <div className="floor-plan-grid">
                    {ROOMS.map((room, index) => (
                        <div
                            key={room.id}
                            className={`floor-room ${currentRoom.id === room.id ? 'active' : ''}`}
                            onClick={() => handleRoomChange(room)}
                            title={room.name}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="nav-arrows">
                <button
                    className="nav-arrow prev"
                    onClick={() => {
                        const currentIndex = ROOMS.findIndex(r => r.id === currentRoom.id);
                        const prevIndex = currentIndex === 0 ? ROOMS.length - 1 : currentIndex - 1;
                        handleRoomChange(ROOMS[prevIndex]);
                    }}
                >
                    ← Previous
                </button>
                <button
                    className="nav-arrow next"
                    onClick={() => {
                        const currentIndex = ROOMS.findIndex(r => r.id === currentRoom.id);
                        const nextIndex = (currentIndex + 1) % ROOMS.length;
                        handleRoomChange(ROOMS[nextIndex]);
                    }}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default VirtualTour;
