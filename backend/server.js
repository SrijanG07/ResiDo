const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");

// Load environment variables
dotenv.config();

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable for development
  }),
);

// CORS - Allow localhost in dev, configured URLs in production
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      // Allow all localhost origins during development
      if (origin && origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      // Allow Vercel preview deployments
      if (origin && origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      // Otherwise use the configured FRONTEND_URL
      if (origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// HEALTH CHECK
// ============================================
app.get("/", (req, res) => {
  res.json({
    message: "ResiDo Backend API is running 🚀",
    version: "2.0.0",
    features: ["Firebase Auth", "Enhanced Security", "Rate Limiting"],
  });
});

// ============================================
// ROUTES
// ============================================

// Import routes
const authRoutes = require("./routes/auth");
const authEnhancedRoutes = require("./routes/authEnhanced");
const propertyRoutes = require("./routes/properties");
const inquiryRoutes = require("./routes/inquiries");
const userRoutes = require("./routes/users");
const newsRoutes = require("./routes/news");
const predictionRoutes = require("./routes/prediction");
const messageRoutes = require("./routes/messages");
const reviewRoutes = require("./routes/reviews");
const wishlistRoutes = require("./routes/wishlist");
const fraudRoutes = require("./routes/fraud");
const chatRoutes = require("./routes/chat");
const visitsRoutes = require("./routes/visits");
const uploadRoutes = require("./routes/upload");

// Import services
const newsService = require("./services/newsService");

// Mount routes - Enhanced auth takes priority
app.use("/api/auth", authEnhancedRoutes);
app.use("/api/auth/legacy", authRoutes); // Keep legacy routes for backward compatibility
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/predict-price", predictionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/visits", visitsRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

// Database connection and server start
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
    return sequelize.sync({ alter: true }); // Sync new tables
  })
  .then(() => {
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Server listening on http://localhost:${PORT}`);
      console.log(`📡 Server address:`, server.address());

      // Setup cron job - fetch news every 4 hours
      cron.schedule("0 */4 * * *", async () => {
        console.log("⏰ Running scheduled news fetch...");
        await newsService.refreshNews();
      });

      // Initial news fetch on startup (delayed by 10 seconds)
      setTimeout(async () => {
        console.log("📰 Initial news fetch on startup...");
        await newsService.refreshNews();
      }, 10000);
    });

    server.on("error", (err) => {
      console.error("❌ Server error:", err);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
