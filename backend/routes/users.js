const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const propertyController = require('../controllers/propertyController');

router.get('/my-properties', authMiddleware, propertyController.getOwnerProperties);

module.exports = router;
