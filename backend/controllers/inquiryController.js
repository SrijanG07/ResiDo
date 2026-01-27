const { Inquiry, Property, User } = require('../models');

exports.createInquiry = async (req, res) => {
    try {
        const { property_id, message } = req.body;

        const inquiry = await Inquiry.create({
            property_id,
            sender_id: req.user.id,
            message
        });

        res.status(201).json(inquiry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({
            where: { sender_id: req.user.id },
            include: [
                {
                    model: Property,
                    as: 'property',
                    include: [{ model: User, as: 'owner', attributes: ['name', 'phone', 'email'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPropertyInquiries = async (req, res) => {
    try {
        const { property_id } = req.params;

        // Verify property ownership
        const property = await Property.findByPk(property_id);
        if (!property || property.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const inquiries = await Inquiry.findAll({
            where: { property_id },
            include: [
                { model: User, as: 'sender', attributes: ['name', 'phone', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
