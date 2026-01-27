const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (owner/broker only)
router.post('/', authMiddleware, requireRole('owner', 'broker'), propertyController.createProperty);
router.put('/:id', authMiddleware, requireRole('owner', 'broker'), propertyController.updateProperty);
router.delete('/:id', authMiddleware, requireRole('owner', 'broker'), propertyController.deleteProperty);

module.exports = router;
