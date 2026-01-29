const express = require('express');
const router = express.Router();
const PricePredictionService = require('../services/pricePredictionService');

/**
 * @route POST /api/predict-price
 * @desc Get AI price prediction for property
 * @access Public
 */
router.post('/', async (req, res) => {
    try {
        const propertyData = req.body;
        
        // Validate required fields
        if (!propertyData.size || propertyData.size <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Property size is required'
            });
        }

        const prediction = PricePredictionService.predict(propertyData);
        
        if (prediction.success) {
            res.json(prediction);
        } else {
            res.status(500).json(prediction);
        }
    } catch (error) {
        console.error('Price prediction route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to predict price'
        });
    }
});

module.exports = router;
