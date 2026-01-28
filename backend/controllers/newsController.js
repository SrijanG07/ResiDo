const PropertyNews = require('../models/PropertyNews');
const { Op } = require('sequelize');
const newsService = require('../services/newsService');

/**
 * Get all news articles (paginated)
 */
exports.getNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { count, rows } = await PropertyNews.findAndCountAll({
            order: [['published_at', 'DESC']],
            limit,
            offset
        });

        res.json({
            articles: rows,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit),
                hasMore: offset + rows.length < count
            }
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

/**
 * Get news by category
 */
exports.getNewsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { count, rows } = await PropertyNews.findAndCountAll({
            where: { category },
            order: [['published_at', 'DESC']],
            limit,
            offset
        });

        res.json({
            articles: rows,
            category,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit),
                hasMore: offset + rows.length < count
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news by category' });
    }
};

/**
 * Get news mentioning a specific city
 */
exports.getNewsByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;

        // Search in city_mentions JSON array
        const { count, rows } = await PropertyNews.findAndCountAll({
            where: {
                city_mentions: {
                    [Op.contains]: [city]
                }
            },
            order: [['published_at', 'DESC']],
            limit,
            offset
        });

        res.json({
            articles: rows,
            city,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch city news' });
    }
};

/**
 * Get related news for a property (based on city)
 */
exports.getRelatedNews = async (req, res) => {
    try {
        const { city } = req.query;
        const limit = parseInt(req.query.limit) || 3;

        let where = {};
        if (city) {
            where.city_mentions = { [Op.contains]: [city] };
        }

        const articles = await PropertyNews.findAll({
            where,
            order: [['published_at', 'DESC']],
            limit
        });

        res.json({ articles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch related news' });
    }
};

/**
 * Get all categories with counts
 */
exports.getCategories = async (req, res) => {
    try {
        const categories = await PropertyNews.findAll({
            attributes: [
                'category',
                [PropertyNews.sequelize.fn('COUNT', 'id'), 'count']
            ],
            group: ['category']
        });

        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

/**
 * Manually trigger news refresh (admin only)
 */
exports.refreshNews = async (req, res) => {
    try {
        const result = await newsService.refreshNews();
        res.json({
            message: 'News refresh complete',
            ...result
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh news' });
    }
};
