import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './VirtualTour.css';

// Panorama images from user's pictures
const ROOMS = [
    {
        id: 'living',
        name: 'Living Room',
        image: '/panoramas/room1.jpg'
    },
    {
        id: 'living2',
        name: 'Living Room (View 2)',
        image: '/panoramas/room2.jpg'
    },
    {
        id: 'kitchen',
        name: 'Kitchen',
        image: '/panoramas/room3.jpg'
    },
    {
        id: 'bedroom',
        name: 'Master Bedroom',
        image: '/panoramas/room4.jpg'
    },
    {
        id: 'dining',
        name: 'Dining Area',
        image: '/panoramas/room5.jpg'
    }
];

// 360 Sphere Component
function PanoramaSphere({ imageUrl }) {
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, imageUrl);

    useEffect(() => {
        if (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.x = -1;
        }
    }, [texture]);

    return (
        <mesh ref={meshRef} scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

// Loading component
function LoadingScreen() {
    return (
        <div className="panorama-loading">
            <div className="loader"></div>
            <p>Loading room...</p>
        </div>
    );
}

// Main Tour Component
function VirtualTour({ onBack }) {
    const [currentRoom, setCurrentRoom] = useState(ROOMS[0]);
    const [showIntro, setShowIntro] = useState(true);

    if (showIntro) {
        return (
            <div className="virtual-tour-intro">
                <button className="btn btn-outline back-btn" onClick={onBack}>← Back to Home</button>

                <div className="featured-property">
                    <div className="featured-badge">🏠 360° Virtual Tour</div>
                    <h1>Luxury 3BHK Apartment</h1>
                    <p className="featured-location">📍 Koramangala, Bangalore</p>

                    <div className="featured-image">
                        <img src={ROOMS[0].image} alt="Apartment" />
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
                        🚪 Explore Inside
                    </button>
                    <p className="tour-hint">Drag to look around • Click rooms below to navigate</p>

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

    return (
        <div className="virtual-tour-3d">
            {/* Header */}
            <div className="tour-header">
                <button className="btn btn-outline" onClick={onBack}>← Exit Tour</button>
                <div className="tour-title">
                    <h2>360° Virtual Tour</h2>
                    <span className="current-room">{currentRoom.name}</span>
                </div>
                <div className="tour-controls-hint">
                    🖱️ Drag to look around
                </div>
            </div>

            {/* 3D Canvas */}
            <Suspense fallback={<LoadingScreen />}>
                <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
                    <PanoramaSphere imageUrl={currentRoom.image} />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        rotateSpeed={-0.5}
                        autoRotate={false}
                    />
                </Canvas>
            </Suspense>

            {/* Room Navigation */}
            <div className="room-nav">
                <h3>Rooms</h3>
                <div className="room-buttons">
                    {ROOMS.map(room => (
                        <button
                            key={room.id}
                            className={`room-btn ${currentRoom.id === room.id ? 'active' : ''}`}
                            onClick={() => setCurrentRoom(room)}
                        >
                            {room.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Minimap */}
            <div className="tour-minimap">
                <div className="minimap-title">Floor Plan</div>
                <div className="minimap-grid">
                    {ROOMS.map(room => (
                        <div
                            key={room.id}
                            className={`minimap-room ${currentRoom.id === room.id ? 'active' : ''}`}
                            onClick={() => setCurrentRoom(room)}
                            title={room.name}
                        >
                            {room.name.charAt(0)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VirtualTour;
