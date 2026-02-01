import React, { useEffect, useState, Suspense, lazy } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LuxuryHomePage from "./pages/LuxuryHomePage";
import LuxuryBrowseProperties from "./pages/LuxuryBrowseProperties";
import LuxuryPropertyDetail from "./pages/LuxuryPropertyDetail";
import OwnerLanding from "./pages/owner/OwnerLanding";
import OwnerLogin from "./pages/owner/OwnerLogin";
import UserLogin from "./pages/UserLogin";
import "./styles/luxury-theme.css";
import "./index.css";

// Lazy load VirtualTour and OwnerDashboard
const VirtualTour = lazy(() => import("./pages/VirtualTour"));
const OwnerDashboard = lazy(() => import("./pages/owner/OwnerDashboard"));
const PropertyNews = lazy(() => import("./pages/PropertyNews"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const EMICalculatorPage = lazy(() => import("./pages/EMICalculatorPage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const MarketAnalytics = lazy(() => import("./pages/MarketAnalytics"));

// Sample property data
const PROPERTIES = [
  {
    id: 1,
    price: "₹95,00,000",
    type: "For Sale",
    location: "Koramangala, Bangalore",
    sqft: "1,450",
    beds: 3,
    baths: 2,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    price: "₹1,45,00,000",
    type: "For Sale",
    location: "Whitefield, Bangalore",
    sqft: "1,800",
    beds: 4,
    baths: 3,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    price: "₹85,50,000",
    type: "For Sale",
    location: "HSR Layout, Bangalore",
    sqft: "1,200",
    beds: 2,
    baths: 2,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    price: "₹1,15,00,000",
    type: "For Sale",
    location: "Indiranagar, Bangalore",
    sqft: "1,550",
    beds: 3,
    baths: 2,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    price: "₹1,65,00,000",
    type: "For Sale",
    location: "Jayanagar, Bangalore",
    sqft: "2,100",
    beds: 4,
    baths: 3,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    price: "₹78,00,000",
    type: "For Sale",
    location: "Electronic City, Bangalore",
    sqft: "1,100",
    beds: 2,
    baths: 2,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
  },
];

const FEATURED_HOMES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=400&fit=crop",
];

// Loading component for lazy loaded pages
function LuxuryLoading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "var(--color-bg-primary, #0b0d0f)",
        color: "var(--color-text-primary, #fff)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
          Loading...
        </h2>
        <p style={{ color: "var(--color-text-muted, #64748b)" }}>Please wait</p>
      </div>
    </div>
  );
}

function App() {
  const { user, logout } = useAuth();

  // Initialize state from localStorage for persistence on refresh
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("ResiDo_currentPage");
    return savedPage || "home";
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    const savedId = localStorage.getItem("ResiDo_selectedPropertyId");
    return savedId ? parseInt(savedId) : null;
  });
  const [selectedPropertyInfo, setSelectedPropertyInfo] = useState(null);
  const [returnTo, setReturnTo] = useState(null);
  const [searchFilters, setSearchFilters] = useState("");

  // Persist current page to localStorage
  useEffect(() => {
    localStorage.setItem("ResiDo_currentPage", currentPage);
    if (selectedPropertyId) {
      localStorage.setItem(
        "ResiDo_selectedPropertyId",
        selectedPropertyId.toString(),
      );
    }
  }, [currentPage, selectedPropertyId]);

  // Navigation handler with optional filters
  const handleNavigate = (page, filters = "") => {
    setCurrentPage(page);
    if (filters) {
      setSearchFilters(filters);
    }
  };

  // Handle property view
  const handleViewProperty = (id) => {
    setSelectedPropertyId(id);
    setCurrentPage("detail");
  };

  // Handle virtual tour with property info
  const handleStartTour = (propertyId, propertyInfo = null) => {
    setSelectedPropertyId(propertyId);
    setSelectedPropertyInfo(propertyInfo);
    setCurrentPage("tour");
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  // Handle Browse Properties page
  if (currentPage === "browse") {
    return (
      <LuxuryBrowseProperties
        onViewProperty={handleViewProperty}
        onNavigate={handleNavigate}
        initialFilters={searchFilters}
      />
    );
  }

  // Handle Property Detail page
  if (currentPage === "detail" && selectedPropertyId) {
    return (
      <LuxuryPropertyDetail
        propertyId={selectedPropertyId}
        onBack={() => setCurrentPage("browse")}
        onNavigate={handleNavigate}
        onStartTour={handleStartTour}
      />
    );
  }

  // Handle Virtual Tour page with lazy loading
  if (currentPage === "tour") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <VirtualTour
          onBack={() => {
            if (selectedPropertyId) {
              setCurrentPage("detail");
            } else {
              setCurrentPage("home");
            }
          }}
          propertyId={selectedPropertyId}
          propertyInfo={selectedPropertyInfo}
        />
      </Suspense>
    );
  }

  // Handle Owner Landing page
  if (currentPage === "owner-landing") {
    return (
      <OwnerLanding
        onLogin={() => setCurrentPage("owner-login")}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  // Handle User Login page (for buyers/general users)
  if (currentPage === "user-login") {
    return (
      <UserLogin
        onSuccess={() => {
          const redirectTo = returnTo || "home";
          setReturnTo(null);
          setCurrentPage(redirectTo);
        }}
        onBack={() => setCurrentPage("home")}
        onNavigate={handleNavigate}
      />
    );
  }

  // Handle Owner Login page
  if (currentPage === "owner-login") {
    return (
      <OwnerLogin
        onSuccess={() => {
          const redirectTo = returnTo || "owner-dashboard";
          setReturnTo(null);
          setCurrentPage(redirectTo);
        }}
        onBack={() => setCurrentPage("owner-landing")}
        allowAllUsers={returnTo !== null}
      />
    );
  }

  // Handle Owner Dashboard (protected)
  if (currentPage === "owner-dashboard") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <OwnerDashboard
          onLogout={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
      </Suspense>
    );
  }

  // Handle Property News page
  if (currentPage === "news") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <PropertyNews onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  // Handle Wishlist page
  if (currentPage === "wishlist") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <WishlistPage
          onViewProperty={(id) => {
            setSelectedPropertyId(id);
            setCurrentPage("detail");
          }}
          onNavigate={(page) => {
            if (page === "owner-login") {
              setReturnTo("wishlist");
            }
            setCurrentPage(page);
          }}
        />
      </Suspense>
    );
  }

  // Handle Messages page
  if (currentPage === "messages") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <MessagesPage
          onBack={() => setCurrentPage("home")}
          onNavigate={(page) => {
            if (page === "owner-login") {
              setReturnTo("messages");
            }
            setCurrentPage(page);
          }}
        />
      </Suspense>
    );
  }

  // Handle EMI Calculator page
  if (currentPage === "emi-calculator") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <EMICalculatorPage onBack={() => setCurrentPage("home")} />
      </Suspense>
    );
  }

  // Handle About Us page
  if (currentPage === "about") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <AboutUs onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  // Handle Market Analytics page
  if (currentPage === "market-analytics") {
    return (
      <Suspense fallback={<LuxuryLoading />}>
        <MarketAnalytics onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  // Home page - Luxury Version
  return (
    <LuxuryHomePage
      onNavigate={handleNavigate}
      onViewProperty={handleViewProperty}
    />
  );
}

export default App;
