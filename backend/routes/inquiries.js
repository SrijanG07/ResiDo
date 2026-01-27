const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, inquiryController.createInquiry);
router.get('/', authMiddleware, inquiryController.getUserInquiries);
router.get('/property/:property_id', authMiddleware, inquiryController.getPropertyInquiries);

module.exports = router;
