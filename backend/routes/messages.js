const express = require('express');
const router = express.Router();
const { Message, Inquiry, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route GET /api/messages/:inquiryId
 * @desc Get all messages for an inquiry
 * @access Private
 */
router.get('/:inquiryId', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: { inquiry_id: req.params.inquiryId },
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'email', 'user_type']
            }],
            order: [['created_at', 'ASC']]
        });
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * @route POST /api/messages
 * @desc Send a new message
 * @access Private
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { inquiry_id, content } = req.body;
        
        if (!inquiry_id || !content) {
            return res.status(400).json({ error: 'Inquiry ID and content are required' });
        }

        // Verify user has access to this inquiry
        const inquiry = await Inquiry.findByPk(inquiry_id);
        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        const message = await Message.create({
            inquiry_id,
            sender_id: req.user.id,
            content
        });

        // Get the message with sender info
        const fullMessage = await Message.findByPk(message.id, {
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'email', 'user_type']
            }]
        });

        // Update inquiry status to 'replied' if owner is replying
        if (req.user.user_type === 'owner') {
            await inquiry.update({ status: 'replied' });
        }

        res.status(201).json(fullMessage);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

/**
 * @route PUT /api/messages/:id/read
 * @desc Mark message as read
 * @access Private
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        
        await message.update({ is_read: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
});

module.exports = router;
