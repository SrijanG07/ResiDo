const { Property, Image, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllProperties = async (req, res) => {
    try {
        const { city, locality, min_price, max_price, property_type, listing_type, bedrooms, status } = req.query;

        let where = {};

        if (city) where.city = { [Op.iLike]: `%${city}%` };
        if (locality) where.locality = { [Op.iLike]: `%${locality}%` };
        if (min_price) where.price = { ...where.price, [Op.gte]: parseInt(min_price) };
        if (max_price) where.price = { ...where.price, [Op.lte]: parseInt(max_price) };
        if (property_type) where.property_type = property_type;
        if (listing_type) where.listing_type = listing_type;
        if (bedrooms) where.bedrooms = parseInt(bedrooms);
        if (status) where.status = status;
        else where.status = 'available'; // Default to available properties

        const properties = await Property.findAll({
            where,
            include: [
                { model: Image, as: 'images' },
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'email', 'user_type'] }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id, {
            include: [
                { model: Image, as: 'images' },
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'email', 'user_type'] }
            ]
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProperty = async (req, res) => {
    try {
        const propertyData = {
            ...req.body,
            owner_id: req.user.id
        };

        const property = await Property.create(propertyData);

        // Add images if provided
        if (req.body.images && req.body.images.length > 0) {
            const images = req.body.images.map((url, index) => ({
                property_id: property.id,
                image_url: url,
                display_order: index
            }));
            await Image.bulkCreate(images);
        }

        const propertyWithImages = await Property.findByPk(property.id, {
            include: [{ model: Image, as: 'images' }]
        });

        res.status(201).json(propertyWithImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        if (property.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this property' });
        }

        await property.update(req.body);

        const updatedProperty = await Property.findByPk(property.id, {
            include: [{ model: Image, as: 'images' }]
        });

        res.json(updatedProperty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        if (property.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this property' });
        }

        await property.destroy();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOwnerProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { owner_id: req.user.id },
            include: [{ model: Image, as: 'images' }],
            order: [['created_at', 'DESC']]
        });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
