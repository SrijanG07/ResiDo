# 🏠 ResiDo - Modern Real Estate Platform

<div align="center">

![ResiDo Banner](https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=400&fit=crop)

**A comprehensive property buy-sell platform with immersive virtual tours, AI-powered search, and real-time market analytics.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-success?style=for-the-badge)](https://resido-frontend.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Running-blue?style=for-the-badge)](https://resido-backend.vercel.app)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Team](#-team)
- [Screenshots](#-screenshots)

---

## 🎯 Overview

**ResiDo** is a full-stack real estate platform designed to revolutionize the property buying and selling experience in India. The platform features an elegant luxury-themed UI, immersive 360° virtual tours, AI-powered property search, comprehensive market analytics, and a robust backend supporting 258+ properties across 10 major Indian cities.

### Key Highlights
- 🏘️ **258+ Properties** across Bangalore, Mumbai, Delhi, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, and Chandigarh
- 🎨 **Luxury-themed UI** with smooth GSAP animations and modern design
- 🔒 **Firebase Authentication** with Google OAuth, Email/Password, and Phone OTP
- 🤖 **AI Chatbot** powered by Groq LLM for natural language property search
- 🗺️ **Interactive Maps** with OpenStreetMap, nearby amenities, and street view

---

## ✨ Features

### 1. 🏠 Property Browsing & Search

**Description:** A sophisticated property browsing system with advanced filtering capabilities that allows users to explore properties with ease.

**What it does:**
- Browse through 258+ verified properties with high-quality images
- Advanced filters for price range, BHK, property type, location, and amenities
- Real-time search with instant results
- Sort by price, date listed, or relevance
- Property cards display key information at a glance

**Technologies Used:**
- React.js for dynamic UI rendering
- PostgreSQL with Sequelize ORM for database queries
- Leaflet.js for map integration
- CSS Grid and Flexbox for responsive layouts

**Developed by:** Srijan Gupta, Kkshiteej Tiwari

---

### 2. 🔮 360° Virtual Tours

**Description:** An immersive virtual property viewing experience using panoramic images, allowing potential buyers to explore properties from anywhere in the world.

**What it does:**
- Full 360-degree panoramic room exploration
- Navigate between 27 different room types (living room, bedroom, kitchen, bathroom, etc.)
- Smooth transitions and intuitive controls
- Mobile-friendly touch gestures
- Room thumbnails for quick navigation
- Hotspots for interactive elements

**Technologies Used:**
- **Marzipano** - Industry-standard 360° panorama viewer library
- Custom CSS-based panorama viewer as fallback
- High-resolution HDR panoramic images from Poly Haven
- React lazy loading for performance optimization

**Developed by:** Kkshiteej Tiwari, Ridwan Umar

---

### 3. 🤖 AI-Powered Property Search Chatbot

**Description:** A conversational AI assistant that understands natural language queries and helps users find their perfect property without navigating complex filters.

**What it does:**
- Natural language processing for queries like "2BHK under 20L near metro in Bangalore"
- Intelligent parsing of price ranges, locations, and preferences
- Real-time property recommendations based on conversation
- Session persistence for continued conversations
- Quick prompt suggestions for common searches

**Technologies Used:**
- **Groq SDK** - Ultra-fast LLM inference (Llama 3.1 70B model)
- Custom NLP parser for local query processing
- PostgreSQL for property matching
- Real-time WebSocket-like communication

**Developed by:** Kkshiteej Tiwari

---

### 4. 🗺️ Interactive Property Maps

**Description:** Comprehensive mapping solution that displays property locations with nearby amenities, distance calculations, and street-level views.

**What it does:**
- Property markers with price labels on the map
- Cluster markers for multiple properties in the same area
- Nearby amenities discovery (schools, hospitals, banks, metro stations, etc.)
- Distance and walking/driving time calculations
- Street View integration for ground-level exploration
- Custom radius filter for location-based search
- Route planning to property

**Technologies Used:**
- **Leaflet.js** - Open-source mapping library
- **OpenStreetMap** - Free map tiles
- **Overpass API** - Real-time amenity data
- **Mapillary** - Street-level imagery
- **Leaflet.MarkerCluster** - Efficient marker clustering

**Developed by:** Ridwan Umar, Srijan Gupta

---

### 5. 💰 EMI Calculator

**Description:** A comprehensive loan calculator that helps buyers understand their monthly payments, including support for various Indian home loan schemes.

**What it does:**
- Calculate EMI based on loan amount, interest rate, and tenure
- Pre-configured schemes: PMAY, SBI, HDFC, ICICI, LIC Housing
- Down payment percentage slider (10-50%)
- Loan tenure selection (5-30 years)
- Affordability check based on monthly income
- Tax benefit calculation (Section 80C & 24b)
- Visual breakdown with pie chart (principal vs interest)
- PMAY subsidy calculation for eligible buyers

**Technologies Used:**
- React.js for interactive UI
- Standard EMI formula implementation
- CSS animations for visual feedback
- Responsive design for mobile users

**Developed by:** Kkshiteej Tiwari

---

### 6. 📊 Market Analytics Dashboard

**Description:** A data-driven analytics platform providing comprehensive insights into real estate market trends across major Indian cities.

**What it does:**
- City-wise price trend analysis (2020-2025)
- Property type distribution charts
- Hot locality identification with growth indicators
- Investment insights and recommendations
- Price forecasting with linear trend projection
- City comparison mode (compare up to 3 cities)
- Buyer preference analytics
- Market summary with key statistics

**Technologies Used:**
- **Chart.js** - Data visualization library
- Custom React components for analytics cards
- CSS Grid for responsive dashboard layout
- Memoized calculations for performance
- Frontend-only implementation (no backend dependency)

**Developed by:** Srijan Gupta

---

### 7. 🔐 Authentication System

**Description:** A secure, multi-method authentication system supporting various sign-in options for both buyers and property owners.

**What it does:**
- Email/Password authentication with validation
- Google OAuth one-click sign-in
- Phone OTP verification (India +91)
- Email verification for new accounts
- Password reset functionality
- Session management with JWT tokens
- Separate owner and buyer portals
- Protected routes for authenticated features

**Technologies Used:**
- **Firebase Authentication** - Google's auth platform
- **JWT (JSON Web Tokens)** - Secure session tokens
- **bcryptjs** - Password hashing
- React Context API for auth state management

**Developed by:** Kkshiteej Tiwari, Ridwan Umar

---

### 8. 📅 Schedule Property Visits

**Description:** An integrated scheduling system that allows potential buyers to book property visits directly through the platform.

**What it does:**
- Select preferred date and time slot
- 30-minute time slots from 9 AM to 6:30 PM
- Automatic form pre-fill for logged-in users
- Notes section for special requests
- Visit confirmation to both buyer and owner
- View and manage scheduled visits

**Technologies Used:**
- React modal components
- Express.js REST API
- PostgreSQL for visit records
- Date validation and formatting

**Developed by:** Ridwan Umar

---

### 9. 💬 Messaging System

**Description:** A real-time messaging platform enabling direct communication between property buyers and owners.

**What it does:**
- Inquiry-based conversation threads
- Real-time message updates
- Message history preservation
- Property context in conversations
- Read/unread status indicators
- Mobile-responsive chat interface

**Technologies Used:**
- React.js for chat UI
- PostgreSQL for message storage
- RESTful API endpoints
- Auto-scroll and message formatting

**Developed by:** Ridwan Umar, Srijan Gupta

---

### 10. ❤️ Wishlist & Property Comparison

**Description:** Personal property management features allowing users to save favorites and compare multiple properties side-by-side.

**What it does:**
- Add/remove properties from wishlist
- Compare up to 3 properties simultaneously
- Side-by-side comparison of specifications
- Price, area, amenities comparison
- Persistent wishlist across sessions
- Quick actions from wishlist view

**Technologies Used:**
- React state management
- PostgreSQL for wishlist storage
- JWT-authenticated API calls
- CSS Grid for comparison layout

**Developed by:** Srijan Gupta

---

### 11. 📰 Property News

**Description:** A curated news section providing the latest updates on real estate market trends, regulations, and investment advice.

**What it does:**
- Category-based news filtering
- Categories: Market Trends, Legal & Tax, Buying Tips, Rentals, Infrastructure, Investment
- Paginated article list with "Load More"
- Article cards with images, titles, and summaries
- External links to full articles
- SEO-optimized metadata

**Technologies Used:**
- **NewsAPI** - Real estate news aggregation
- React lazy loading
- Express.js caching for API optimization
- Responsive card design

**Developed by:** Srijan Gupta

---

### 12. 🏢 Owner Dashboard

**Description:** A comprehensive property management portal for owners to list, manage, and track their properties.

**What it does:**
- Add new property listings with images
- **Cloudinary** image upload integration
- Edit existing property details
- View property performance metrics
- Manage incoming inquiries
- Track scheduled visits
- Property status management (available/sold/rented)

**Technologies Used:**
- **Cloudinary** - Cloud image storage and optimization
- **Multer** - File upload handling
- React forms with validation
- Protected owner routes

**Developed by:** Kkshiteej Tiwari, Srijan Gupta

---

### 13. 🎨 Luxury UI Theme

**Description:** A premium, elegant user interface design that provides a sophisticated browsing experience.

**What it does:**
- Dark luxury theme with gold accents
- Smooth scroll animations with GSAP
- Parallax effects on hero sections
- Animated statistics counters
- Gradient overlays and glassmorphism
- Premium typography (Playfair Display + Inter)
- Micro-interactions on buttons and cards
- GPU-accelerated animations

**Technologies Used:**
- **GSAP (GreenSock)** - Professional animation library
- **ScrollTrigger** - Scroll-based animations
- CSS custom properties for theming
- CSS Grid and Flexbox layouts

**Developed by:** Kkshiteej Tiwari

---

### 14. 👥 About Us Page

**Description:** Team introduction page showcasing the developers behind ResiDo with contact information.

**What it does:**
- Team member cards with photos
- Role descriptions and contact details
- GitHub profile links
- Animated entrance effects
- Company mission statement

**Developed by:** Ridwan Umar

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool & Dev Server |
| GSAP | Animations |
| Leaflet.js | Maps |
| Marzipano | 360° Virtual Tours |
| Firebase | Authentication |
| CSS3 | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| PostgreSQL | Database |
| Sequelize | ORM |
| Groq SDK | AI/LLM |
| Cloudinary | Image Storage |
| JWT | Authentication |
| Helmet | Security |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| Vercel | Frontend Hosting |
| Render/Railway | Backend Hosting |
| Docker | Containerization |
| Git | Version Control |

---

## 🏗️ Architecture

```
ResiDo/
├── frontend/                 # React Frontend Application
│   ├── public/              # Static assets & panoramas
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── analytics/   # Market analytics components
│   │   │   ├── auth/        # Authentication components
│   │   │   └── owner/       # Owner portal components
│   │   ├── config/          # Firebase configuration
│   │   ├── context/         # React Context providers
│   │   ├── data/            # Static data files
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── styles/          # Global styles & themes
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── backend/                  # Express Backend Application
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # Sequelize models
│   ├── routes/              # API routes
│   ├── services/            # Business logic services
│   ├── seeds/               # Database seeders
│   └── server.js            # Entry point
│
├── database/                 # Database migrations
├── docs/                     # Documentation
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/SrijanG07/ResiDo.git
cd ResiDo
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Run database migrations and seed
npm run seed

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resido
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resido
DB_USER=your_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq AI
GROQ_API_KEY=your_groq_api_key

# NewsAPI
NEWS_API_KEY=your_newsapi_key

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 👨‍💻 Team

<table>
  <tr>
    <td align="center">
      <img src="dev_images/Kkshiteej.jpeg" width="150px" style="border-radius: 50%"/><br />
      <b>Kkshiteej Tiwari</b><br />
      <i>Team Lead & Full Stack Developer</i><br />
      <a href="mailto:Kkshiteej.Tiwari@iiitb.ac.in">📧 Email</a><br />
      <sub>
        • Project Architecture & Setup<br />
        • 360° Virtual Tour Implementation<br />
        • AI Chatbot Integration (Groq)<br />
        • EMI Calculator<br />
        • Luxury UI Theme & Animations<br />
        • Firebase Authentication<br />
        • Owner Dashboard & Cloudinary<br />
        • Deployment Configuration
      </sub>
    </td>
    <td align="center">
      <img src="dev_images/Srijan.jpg" width="150px" style="border-radius: 50%"/><br />
      <b>Srijan Gupta</b><br />
      <i>Full Stack Developer</i><br />
      <a href="mailto:srijan.gupta@iiitb.ac.in">📧 Email</a><br />
      <sub>
        • Backend Infrastructure Setup<br />
        • Database Design (258 Properties)<br />
        • Property Browsing & Filters<br />
        • Market Analytics Dashboard<br />
        • Wishlist & Comparison Feature<br />
        • Property News Integration<br />
        • Messaging System Backend<br />
        • API Development
      </sub>
    </td>
    <td align="center">
      <img src="dev_images/Ridwan.jpg" width="150px" style="border-radius: 50%"/><br />
      <b>Ridwan Umar</b><br />
      <i>Full Stack Developer</i><br />
      <a href="mailto:ridwan.umar@iiitb.ac.in">📧 Email</a><br />
      <sub>
        • Interactive Map Implementation<br />
        • Nearby Amenities Feature<br />
        • Street View Integration<br />
        • Schedule Visit Feature<br />
        • Messaging UI Implementation<br />
        • About Us Page<br />
        • Virtual Tour Enhancements<br />
        • Authentication UI
      </sub>
    </td>
  </tr>
</table>

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=400&fit=crop)
*Luxury-themed landing page with animated hero section*

### Property Browsing
*Advanced filters and property cards with map view*

### 360° Virtual Tour
*Immersive panoramic property exploration*

### AI Chatbot
*Natural language property search assistant*

### Market Analytics
*Comprehensive real estate market insights*

---

## 📄 License

This project is developed as part of the academic curriculum at **IIIT Bangalore**.

---

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) - Property images
- [Poly Haven](https://polyhaven.com) - HDR panoramic images
- [OpenStreetMap](https://www.openstreetmap.org) - Map data
- [Groq](https://groq.com) - AI inference
- [Firebase](https://firebase.google.com) - Authentication
- [Vercel](https://vercel.com) - Hosting

---

<div align="center">
  <p>Made with ❤️ by Team ResiDo</p>
  <p>IIIT Bangalore | January 2026</p>
</div>
