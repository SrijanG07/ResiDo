const express = require('express');
const router = express.Router();
const { ChatSession, ChatMessage, Property, Image } = require('../models');
const { extractSearchIntent, generateResponse } = require('../services/groqService');
const { Op } = require('sequelize');

// POST /api/chat - Send message and get response
router.post('/', async (req, res) => {
    try {
        const { message, sessionToken } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get or create session
        let session;
        if (sessionToken) {
            session = await ChatSession.findOne({ where: { session_token: sessionToken } });
        }

        if (!session) {
            session = await ChatSession.create({
                search_context: {}
            });
        }

        // Get conversation history for context
        const history = await ChatMessage.findAll({
            where: { session_id: session.id },
            order: [['created_at', 'ASC']],
            limit: 10
        });

        const conversationHistory = history.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Save user message
        await ChatMessage.create({
            session_id: session.id,
            role: 'user',
            content: message
        });

        // Extract search intent and get matching property IDs from AI
        const intentResult = await extractSearchIntent(message, conversationHistory);

        // Fetch properties by the IDs that AI selected
        let properties = [];
        if (intentResult.matching_ids && intentResult.matching_ids.length > 0) {
            properties = await Property.findAll({
                where: {
                    id: { [Op.in]: intentResult.matching_ids }
                },
                include: [{
                    model: Image,
                    as: 'images',
                    limit: 1
                }],
                limit: 6
            });
        }

        // Merge with existing context for follow-up queries
        const currentContext = session.search_context || {};
        const mergedFilters = { ...currentContext, ...intentResult.filters };

        // Update session context
        await session.update({ search_context: mergedFilters });

        // Generate friendly response with actual property details
        const aiResponse = await generateResponse(
            message,
            mergedFilters,
            properties,
            conversationHistory
        );

        // Save assistant message
        await ChatMessage.create({
            session_id: session.id,
            role: 'assistant',
            content: aiResponse,
            extracted_filters: mergedFilters,
            search_results_count: properties.length
        });

        res.json({
            sessionToken: session.session_token,
            message: aiResponse,
            filters: mergedFilters,
            properties: properties.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                listing_type: p.listing_type,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                locality: p.locality,
                city: p.city,
                image: p.images?.[0]?.image_url || null
            })),
            totalResults: properties.length
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// GET /api/chat/history/:sessionToken - Get conversation history
router.get('/history/:sessionToken', async (req, res) => {
    try {
        const { sessionToken } = req.params;

        const session = await ChatSession.findOne({
            where: { session_token: sessionToken }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const messages = await ChatMessage.findAll({
            where: { session_id: session.id },
            order: [['created_at', 'ASC']]
        });

        res.json({
            sessionToken: session.session_token,
            context: session.search_context,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.created_at
            }))
        });

    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

module.exports = router;
