import React, { useState, useRef, useEffect } from 'react';
import './VirtualTour.css';

// Panorama images from public folder
const ROOMS = [
    {
        id: 'living',
        name: 'Living Room',
        image: '/panoramas/room1.jpg',
        description: 'Spacious living area with modern furnishings'
    },
    {
        id: 'living2',
        name: 'Living Room (View 2)',
        image: '/panoramas/room2.jpg',
        description: 'Alternative angle showcasing natural lighting'
    },
    {
        id: 'kitchen',
        name: 'Kitchen',
        image: '/panoramas/room3.jpg',
        description: 'Fully equipped modular kitchen'
    },
    {
        id: 'bedroom',
        name: 'Master Bedroom',
        image: '/panoramas/room4.jpg',
        description: 'Luxurious bedroom with attached balcony'
    },
    {
        id: 'dining',
        name: 'Dining Area',
        image: '/panoramas/room5.jpg',
        description: 'Elegant dining space for family gatherings'
    }
];

// 360 Panorama Viewer Component using CSS transforms
function PanoramaViewer({ imageUrl, roomName }) {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    // Handle mouse/touch drag for panorama rotation
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos({
            x: e.clientX || e.touches?.[0]?.clientX || 0,
            y: e.clientY || e.touches?.[0]?.clientY || 0
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
        const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

        const deltaX = clientX - startPos.x;
        const deltaY = clientY - startPos.y;

        setRotation(prev => ({
            x: Math.max(-30, Math.min(30, prev.x - deltaY * 0.2)),
            y: prev.y + deltaX * 0.3
        }));

        setStartPos({ x: clientX, y: clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Handle zoom with mouse wheel
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
    };

    // Auto-rotate effect
    useEffect(() => {
        if (isDragging) return;

        const autoRotate = setInterval(() => {
            setRotation(prev => ({
                ...prev,
                y: prev.y + 0.05
            }));
        }, 50);

        return () => clearInterval(autoRotate);
    }, [isDragging]);

    // Reset rotation when room changes
    useEffect(() => {
        setRotation({ x: 0, y: 0 });
        setZoom(1);
    }, [imageUrl]);

    return (
        <div
            ref={containerRef}
            className="panorama-viewer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
        >
            <div
                className="panorama-image-container"
                style={{
                    transform: `scale(${zoom}) rotateX(${rotation.x}deg)`,
                }}
            >
                <div
                    className="panorama-image"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPositionX: `${rotation.y * 2}px`
                    }}
                />
            </div>

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
                <button onClick={() => setZoom(prev => Math.min(2, prev + 0.2))}>+</button>
                <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}>−</button>
            </div>
        </div>
    );
}

// Main Tour Component
function VirtualTour({ onBack }) {
    const [currentRoom, setCurrentRoom] = useState(ROOMS[0]);
    const [showIntro, setShowIntro] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleRoomChange = (room) => {
        setIsLoading(true);
        setCurrentRoom(room);

        // Simulate loading for smooth transition
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
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
                            <span>5 Rooms • Immersive 360° View</span>
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

            {/* Panorama Viewer */}
            <div className="panorama-wrapper">
                {isLoading && (
                    <div className="panorama-loading">
                        <div className="loader"></div>
                        <p>Loading {currentRoom.name}...</p>
                    </div>
                )}
                <PanoramaViewer
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
