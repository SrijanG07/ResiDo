const express = require('express');
const router = express.Router();
const { Wishlist, Property, Image, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route GET /api/wishlist
 * @desc Get user's wishlist
 * @access Private
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const wishlist = await Wishlist.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Property,
                as: 'property',
                include: [
                    { model: Image, as: 'images', limit: 1 },
                    { model: User, as: 'owner', attributes: ['id', 'name'] }
                ]
            }],
            order: [['created_at', 'DESC']]
        });

        res.json(wishlist.map(w => w.property));
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

/**
 * @route GET /api/wishlist/check/:propertyId
 * @desc Check if property is in wishlist
 * @access Private
 */
router.get('/check/:propertyId', authMiddleware, async (req, res) => {
    try {
        const exists = await Wishlist.findOne({
            where: {
                user_id: req.user.id,
                property_id: req.params.propertyId
            }
        });
        res.json({ isWishlisted: !!exists });
    } catch (error) {
        console.error('Check wishlist error:', error);
        res.status(500).json({ error: 'Failed to check wishlist' });
    }
});

/**
 * @route POST /api/wishlist/:propertyId
 * @desc Add property to wishlist
 * @access Private
 */
router.post('/:propertyId', authMiddleware, async (req, res) => {
    try {
        // Check if already in wishlist
        const exists = await Wishlist.findOne({
            where: {
                user_id: req.user.id,
                property_id: req.params.propertyId
            }
        });

        if (exists) {
            return res.status(400).json({ error: 'Property already in wishlist' });
        }

        await Wishlist.create({
            user_id: req.user.id,
            property_id: req.params.propertyId
        });

        res.status(201).json({ success: true, message: 'Added to wishlist' });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

/**
 * @route DELETE /api/wishlist/:propertyId
 * @desc Remove property from wishlist
 * @access Private
 */
router.delete('/:propertyId', authMiddleware, async (req, res) => {
    try {
        const deleted = await Wishlist.destroy({
            where: {
                user_id: req.user.id,
                property_id: req.params.propertyId
            }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Property not in wishlist' });
        }

        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

module.exports = router;
