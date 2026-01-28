const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// GET /api/news - Get all news (paginated)
router.get('/', newsController.getNews);

// GET /api/news/categories - Get category counts
router.get('/categories', newsController.getCategories);

// GET /api/news/related - Get related news for a property
router.get('/related', newsController.getRelatedNews);

// GET /api/news/category/:category - Get news by category
router.get('/category/:category', newsController.getNewsByCategory);

// GET /api/news/city/:city - Get news mentioning a city
router.get('/city/:city', newsController.getNewsByCity);

// POST /api/news/refresh - Manually trigger refresh (for testing)
router.post('/refresh', newsController.refreshNews);

module.exports = router;
