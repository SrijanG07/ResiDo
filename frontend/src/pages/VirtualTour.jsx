import React, { useState, useRef, useEffect, useMemo } from "react";
import Marzipano from "marzipano";
import "../styles/luxury-theme.css";
import "./VirtualTour.css";

// All available panoramic images pool - 27 total images
const PANORAMA_POOL = {
  // Original named rooms
  living_room: "/panoramas/living_room.jpg",
  lounge: "/panoramas/lounge.jpg",
  kitchen: "/panoramas/kitchen.jpg",
  master_bedroom: "/panoramas/master_bedroom.jpg",
  bedroom: "/panoramas/bedroom.jpg",
  bathroom: "/panoramas/bathroom.jpg", // Always included
  study_room: "/panoramas/study_room.jpg",
  // Room variations
  room1: "/panoramas/room1.jpg",
  room2: "/panoramas/room2.jpg",
  room3: "/panoramas/room3.jpg",
  room4: "/panoramas/room4.jpg",
  room5: "/panoramas/room5.jpg",
  // Additional Panoramic Images (Poly Haven)
  anniversary_lounge: "/panoramas/anniversary_lounge_1k.jpg",
  brown_photostudio: "/panoramas/brown_photostudio_01_2k.jpg",
  combination_room: "/panoramas/combination_room_2k.jpg",
  lythwood_room: "/panoramas/lythwood_room_2k.jpg",
  photo_studio: "/panoramas/photo_studio_01_2k.jpg",
  poly_haven_studio: "/panoramas/poly_haven_studio_2k.jpg",
  small_empty_room1: "/panoramas/small_empty_room_1_2k_1.jpg",
  small_empty_room2: "/panoramas/small_empty_room_2_2k.jpg",
  // Panoramic Living Room Shots
  panoramic_living1: "/panoramas/shot-panoramic-composition-living-room.jpg",
  panoramic_living2:
    "/panoramas/shot-panoramic-composition-living-room%20(1).jpg",
  panoramic_living3:
    "/panoramas/shot-panoramic-composition-living-room%20(2).jpg",
  panoramic_living4:
    "/panoramas/shot-panoramic-composition-living-room%20(3).jpg",
  panoramic_living5:
    "/panoramas/shot-panoramic-composition-living-room%20(4).jpg",
  // WhatsApp Images
  whatsapp_room1:
    "/panoramas/WhatsApp%20Image%202026-01-30%20at%207.22.28%20PM.jpeg",
  whatsapp_room2:
    "/panoramas/WhatsApp%20Image%202026-01-30%20at%207.22.29%20PM.jpeg",
};

// Room templates with descriptions - 27 unique rooms
const ROOM_TEMPLATES = [
  {
    id: "living",
    name: "Living Room",
    key: "living_room",
    description: "Bright and airy living space with natural sunlight",
  },
  {
    id: "lounge",
    name: "Lounge",
    key: "lounge",
    description: "Cozy lounge area with warm ambiance",
  },
  {
    id: "kitchen",
    name: "Kitchen & Dining",
    key: "kitchen",
    description: "Open-plan kitchen with rustic charm",
  },
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    key: "master_bedroom",
    description: "Spacious master suite with ensuite access",
  },
  {
    id: "bedroom",
    name: "Guest Bedroom",
    key: "bedroom",
    description: "Modern guest room with scenic views",
  },
  {
    id: "study",
    name: "Study Room",
    key: "study_room",
    description: "Elegant reading room with classic architecture",
  },
  {
    id: "room1",
    name: "Den",
    key: "room1",
    description: "Private den for relaxation and entertainment",
  },
  {
    id: "room2",
    name: "Family Room",
    key: "room2",
    description: "Comfortable family gathering space",
  },
  {
    id: "room3",
    name: "Home Office",
    key: "room3",
    description: "Productive workspace with modern amenities",
  },
  {
    id: "room4",
    name: "Media Room",
    key: "room4",
    description: "Entertainment area with premium setup",
  },
  {
    id: "room5",
    name: "Guest Suite",
    key: "room5",
    description: "Welcoming space for overnight guests",
  },
  {
    id: "anniversary",
    name: "Anniversary Lounge",
    key: "anniversary_lounge",
    description: "Elegant celebration space with sophisticated decor",
  },
  {
    id: "photostudio",
    name: "Photography Studio",
    key: "brown_photostudio",
    description: "Professional studio with premium lighting",
  },
  {
    id: "combination",
    name: "Multi-Purpose Room",
    key: "combination_room",
    description: "Versatile space for various activities",
  },
  {
    id: "lythwood",
    name: "Lythwood Suite",
    key: "lythwood_room",
    description: "Classic British-style sitting room",
  },
  {
    id: "studio1",
    name: "Creative Studio",
    key: "photo_studio",
    description: "Bright creative workspace",
  },
  {
    id: "studio2",
    name: "Art Studio",
    key: "poly_haven_studio",
    description: "Inspiring space for artistic pursuits",
  },
  {
    id: "empty1",
    name: "Bonus Room",
    key: "small_empty_room1",
    description: "Flexible empty space ready for customization",
  },
  {
    id: "empty2",
    name: "Storage Room",
    key: "small_empty_room2",
    description: "Additional storage and utility space",
  },
  {
    id: "panoramic1",
    name: "Grand Living",
    key: "panoramic_living1",
    description: "Expansive living area with panoramic views",
  },
  {
    id: "panoramic2",
    name: "Modern Lounge",
    key: "panoramic_living2",
    description: "Contemporary lounge with sleek design",
  },
  {
    id: "panoramic3",
    name: "Luxury Sitting",
    key: "panoramic_living3",
    description: "Upscale sitting area with premium finishes",
  },
  {
    id: "panoramic4",
    name: "Designer Living",
    key: "panoramic_living4",
    description: "Architect-designed living space",
  },
  {
    id: "panoramic5",
    name: "Premium Hall",
    key: "panoramic_living5",
    description: "Grand hall with elegant furnishings",
  },
  {
    id: "whatsapp1",
    name: "Sunlit Room",
    key: "whatsapp_room1",
    description: "Bright room with natural sunlight",
  },
  {
    id: "whatsapp2",
    name: "Cozy Corner",
    key: "whatsapp_room2",
    description: "Intimate corner perfect for relaxation",
  },
];

// Seeded random number generator for consistent randomization per property
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Get randomized rooms for a specific property
function getRoomsForProperty(propertyId, bedrooms = 3) {
  const seed = propertyId * 1000; // Use propertyId as seed for consistent randomization

  // Calculate number of rooms based on property size (bedrooms) - now 6-10 rooms with more images
  const numRooms = Math.min(Math.max(bedrooms + 4, 6), 10);

  // Always include bathroom
  const bathroomRoom = {
    id: "bathroom",
    name: "Bathroom",
    image: PANORAMA_POOL.bathroom,
    description: "Contemporary bathroom with modern fixtures",
  };

  // Get available room templates (excluding bathroom which is always added)
  const availableTemplates = ROOM_TEMPLATES.filter((t) => t.id !== "bathroom");

  // Shuffle templates using seeded random
  const shuffled = [...availableTemplates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Take required number of rooms (minus 1 for bathroom)
  const selectedTemplates = shuffled.slice(0, numRooms - 1);

  // Build rooms array with images
  const rooms = selectedTemplates.map((template, index) => ({
    id: template.id,
    name: template.name,
    image: PANORAMA_POOL[template.key] || PANORAMA_POOL.room1,
    description: template.description,
  }));

  // Insert bathroom at a logical position (after bedrooms, around position 3-4)
  const bathroomPosition = Math.min(3, rooms.length);
  rooms.splice(bathroomPosition, 0, bathroomRoom);

  return rooms;
}

// Default property info when no propertyId is provided
const DEFAULT_PROPERTY = {
  id: 1,
  title: "Virtual Tour Demo",
  location: "Experience our 360° Virtual Tour feature",
  bedrooms: 3,
  bathrooms: 2,
  sqft: "1,850",
  price: "Available on all properties",
  isDemo: true,
};

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
        mouseViewMode: "drag",
      },
    });
    viewerRef.current = viewer;

    // Create equirectangular geometry for 360° panorama
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    // Limit view parameters - wider FOV for realistic tour
    const limiter = Marzipano.RectilinearView.limit.traditional(
      4096, // Max resolution
      (120 * Math.PI) / 180, // Max FOV (120 degrees for wider view)
    );

    // Create the view - start zoomed out for full room overview
    const view = new Marzipano.RectilinearView(
      { yaw: 0, pitch: 0, fov: (100 * Math.PI) / 180 }, // Initial view (100° FOV - zoomed out)
      limiter,
    );

    // Create image source
    const source = Marzipano.ImageUrlSource.fromString(imageUrl);

    // Create scene
    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    // Switch to scene
    scene.switchTo({
      transitionDuration: 400,
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
        style={{ width: "100%", height: "100%" }}
      />

      {/* Room indicator */}
      <div className="panorama-room-badge">{roomName}</div>

      {/* Controls hint */}
      <div className="panorama-controls-hint">
        <span>Drag to look around</span>
        <span>Scroll to zoom</span>
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
function VirtualTour({ onBack, propertyId = null, propertyInfo = null }) {
  // Get property details
  const property = propertyInfo || DEFAULT_PROPERTY;
  const effectivePropertyId = propertyId || property.id;

  // Generate rooms based on property ID (memoized for consistency)
  const ROOMS = useMemo(() => {
    return getRoomsForProperty(effectivePropertyId, property.bedrooms || 3);
  }, [effectivePropertyId, property.bedrooms]);

  const [currentRoom, setCurrentRoom] = useState(ROOMS[0]);
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update currentRoom when ROOMS changes
  useEffect(() => {
    setCurrentRoom(ROOMS[0]);
  }, [ROOMS]);

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
          ← Back
        </button>

        <div className="featured-property">
          <div className="featured-badge">
            360° Virtual Tour{property.isDemo ? " Demo" : ""}
          </div>
          <h1>
            {property.isDemo
              ? "Virtual Tour Feature Demo"
              : property.title ||
                `${property.bedrooms || 3}BHK ${property.type || "Apartment"}`}
          </h1>
          <p className="featured-location">
            {property.isDemo
              ? "This feature is available on all properties in Browse Properties"
              : property.location || property.address || "Premium Location"}
          </p>

          <div className="featured-image">
            <img src={ROOMS[0].image} alt="Property Preview" />
            <div className="image-overlay">
              <span>{ROOMS.length} Rooms - Immersive 360° View</span>
            </div>
          </div>

          {!property.isDemo && (
            <div className="featured-stats">
              <div className="stat">
                <span>{property.bedrooms || 3}</span>Bedrooms
              </div>
              <div className="stat">
                <span>{property.bathrooms || 2}</span>Bathrooms
              </div>
              <div className="stat">
                <span>{property.sqft || property.area || "1,500"}</span>Sq Ft
              </div>
              <div className="stat">
                <span>{property.price || "₹85L"}</span>
              </div>
            </div>
          )}

          {property.isDemo && (
            <p
              className="demo-note"
              style={{
                color: "#c9a962",
                marginTop: "20px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Browse our properties to experience virtual tours of real listings
            </p>
          )}

          <button className="btn-start" onClick={() => setShowIntro(false)}>
            Start Virtual Tour
          </button>

          <p className="tour-hint">
            Drag to look around - Click rooms below to navigate
          </p>

          <div className="rooms-preview">
            <h3>Rooms You'll Explore</h3>
            <div className="rooms-grid">
              {ROOMS.map((room) => (
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
          {property.title || `${property.bedrooms || 3}BHK`} -{" "}
          {property.location || "Premium Location"}
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
              className={`room-btn ${currentRoom.id === room.id ? "active" : ""}`}
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

      {/* Navigation Arrows */}
      <div className="nav-arrows">
        <button
          className="nav-arrow prev"
          onClick={() => {
            const currentIndex = ROOMS.findIndex(
              (r) => r.id === currentRoom.id,
            );
            const prevIndex =
              currentIndex === 0 ? ROOMS.length - 1 : currentIndex - 1;
            handleRoomChange(ROOMS[prevIndex]);
          }}
        >
          ← Previous
        </button>
        <button
          className="nav-arrow next"
          onClick={() => {
            const currentIndex = ROOMS.findIndex(
              (r) => r.id === currentRoom.id,
            );
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
