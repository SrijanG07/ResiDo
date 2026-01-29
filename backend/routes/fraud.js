const express = require('express');
const router = express.Router();
const FraudDetectionService = require('../services/fraudDetectionService');
const { Property, Image, User } = require('../models');

/**
 * @route GET /api/fraud/property/:id/trust-score
 * @desc Get trust score and fraud analysis for a property
 * @access Public
 */
router.get('/property/:id/trust-score', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id, {
            include: [
                { model: Image, as: 'images' },
                { model: User, as: 'owner', attributes: ['id', 'name', 'is_verified'] }
            ]
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const analysis = await FraudDetectionService.analyze(property.toJSON());
        res.json(analysis);
    } catch (error) {
        console.error('Trust score error:', error);
        res.status(500).json({ error: 'Failed to analyze property' });
    }
});

/**
 * @route POST /api/fraud/analyze
 * @desc Analyze property data for fraud (without saving)
 * @access Public
 */
router.post('/analyze', async (req, res) => {
    try {
        const propertyData = req.body;
        const analysis = await FraudDetectionService.analyze(propertyData);
        res.json(analysis);
    } catch (error) {
        console.error('Fraud analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze property data' });
    }
});

module.exports = router;
