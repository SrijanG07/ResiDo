const express = require('express');
const router = express.Router();
const { Review, User, Property } = require('../models');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route GET /api/reviews/property/:propertyId
 * @desc Get all reviews for a property
 * @access Public
 */
router.get('/property/:propertyId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { property_id: req.params.propertyId },
            include: [{
                model: User,
                as: 'reviewer',
                attributes: ['id', 'name']
            }],
            order: [['created_at', 'DESC']]
        });

        // Calculate average rating
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.json({
            reviews,
            averageRating: parseFloat(averageRating),
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

/**
 * @route POST /api/reviews/property/:propertyId
 * @desc Add a review for a property
 * @access Private
 */
router.post('/property/:propertyId', authMiddleware, async (req, res) => {
    try {
        const { rating, title, content } = req.body;
        
        if (!rating || !content) {
            return res.status(400).json({ error: 'Rating and content are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if user already reviewed this property
        const existingReview = await Review.findOne({
            where: {
                property_id: req.params.propertyId,
                user_id: req.user.id
            }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this property' });
        }

        const review = await Review.create({
            property_id: req.params.propertyId,
            user_id: req.user.id,
            rating,
            title,
            content
        });

        const fullReview = await Review.findByPk(review.id, {
            include: [{
                model: User,
                as: 'reviewer',
                attributes: ['id', 'name']
            }]
        });

        res.status(201).json(fullReview);
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

/**
 * @route POST /api/reviews/:id/respond
 * @desc Owner response to a review
 * @access Private (Owner only)
 */
router.post('/:id/respond', authMiddleware, async (req, res) => {
    try {
        const { response } = req.body;
        
        if (!response) {
            return res.status(400).json({ error: 'Response content is required' });
        }

        const review = await Review.findByPk(req.params.id, {
            include: [{
                model: Property,
                as: 'property'
            }]
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Verify user is the property owner
        if (review.property.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Only the property owner can respond' });
        }

        await review.update({
            owner_response: response,
            response_date: new Date()
        });

        res.json(review);
    } catch (error) {
        console.error('Respond to review error:', error);
        res.status(500).json({ error: 'Failed to respond to review' });
    }
});

module.exports = router;
