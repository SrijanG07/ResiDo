# RoomGi 🏠

**Property Buy-Sell & Owner Management Platform**

![RoomGi Preview](frontend/public/mascot.png)

A modern property marketplace for buying/selling homes directly from verified owners. Built with a sleek neon green & black UI featuring an interactive 3D mascot.

---

## ✨ Features

- **Property Listings** - Browse flats, homes, villas, plots, and commercial properties
- **Owner Dashboard** - Manage listings with analytics and inquiry tracking
- **Verified Badges** - Trust system for verified owners/brokers
- **Advanced Filters** - Search by location, price, property type, amenities
- **Interactive Maps** - Property locations with Leaflet.js + OpenStreetMap
- **Contact System** - Direct messaging between buyers and sellers
- **3D Mascot** - Floating Spline-powered mascot companion
- **Responsive Design** - Mobile-first approach

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Vanilla CSS** (Custom neon green/black theme)
- **Spline** (3D mascot)
- **Leaflet.js** (Maps)

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** + **Sequelize ORM**
- **JWT Authentication**
- **Multer** (File uploads)

### Deployment
- **Frontend**: Vercel
- **Backend**: Render.com
- **Database**: Render PostgreSQL
- **Images**: Cloudinary

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/RoomGi.git
cd RoomGi

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Running Development Servers

```bash
# Terminal 1 - Frontend (http://localhost:3000)
cd frontend
npm run dev

# Terminal 2 - Backend (http://localhost:5000)
cd backend
npm run dev
```

---

## 📁 Project Structure

```
RoomGi/
├── frontend/               # React + Vite app
│   ├── public/            # Static assets (mascot, images)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles (neon theme)
│   └── package.json
│
├── backend/                # Node.js + Express API
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/            # Sequelize models
│   ├── middleware/        # Auth, validation middleware
│   ├── config/            # Database config
│   └── server.js          # Entry point
│
├── database/               # SQL schemas
│   └── schema.sql
│
└── README.md
```

---

## 🎨 UI Design

The UI features a premium dark theme with neon green accents, inspired by modern property platforms:

- **Hero Section** - Property image grid with "The World of Luxury" tagline
- **Discover Section** - Horizontal property carousel
- **Stats Section** - 840+ Properties, 99% Satisfaction, 204+ Agents
- **Contact Form** - Professional inquiry form
- **Large Footer** - "ROOMGI" brand statement

---

## 📊 Database Schema

Key tables:
- `users` - Buyers, owners, brokers
- `properties` - Listings with geo-coordinates
- `images` - Property photos
- `reviews` - User ratings & comments
- `inquiries` - Buyer-seller messages
- `wishlist` - Saved properties

See [database/schema.sql](database/schema.sql) for full schema.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User signup |
| POST | `/api/auth/login` | User login |
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/:id` | Get single property |
| POST | `/api/properties` | Create property (owner) |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| POST | `/api/inquiries` | Send inquiry |
| GET | `/api/users/:id/listings` | Owner's properties |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Built with 💚 for property seekers everywhere.

---

*Last Updated: January 2026*
