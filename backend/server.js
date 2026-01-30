const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const sequelize = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware - Allow all localhost origins during development
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        // Allow all localhost origins during development
        if (origin.startsWith('http://localhost:')) {
            return callback(null, true);
        }
        // Otherwise use the configured FRONTEND_URL
        if (origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'RoomGi Backend API is running 🚀' });
});

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const inquiryRoutes = require('./routes/inquiries');
const userRoutes = require('./routes/users');
const newsRoutes = require('./routes/news');
const predictionRoutes = require('./routes/prediction');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');
const wishlistRoutes = require('./routes/wishlist');
const fraudRoutes = require('./routes/fraud');
const chatRoutes = require('./routes/chat');

// Import services
const newsService = require('./services/newsService');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/predict-price', predictionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;

// Database connection and server start
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected successfully');
        return sequelize.sync({ alter: true }); // Sync new tables
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);

            // Setup cron job - fetch news every 4 hours
            cron.schedule('0 */4 * * *', async () => {
                console.log('⏰ Running scheduled news fetch...');
                await newsService.refreshNews();
            });

            // Initial news fetch on startup (delayed by 10 seconds)
            setTimeout(async () => {
                console.log('📰 Initial news fetch on startup...');
                await newsService.refreshNews();
            }, 10000);
        });
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
    });
