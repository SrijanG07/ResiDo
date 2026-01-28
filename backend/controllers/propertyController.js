const { Property, Image, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllProperties = async (req, res) => {
    try {
        const {
            // Basic filters
            city, locality, min_price, max_price, property_type, listing_type, bedrooms, status,
            // Furnished & size
            furnished, min_size, max_size,
            // Lifestyle filters
            pet_friendly, vegetarian_only, gender_preference, bachelor_friendly,
            // Availability & lease
            min_lease_months, max_lease_months, available_from, immediate_available,
            // Budget extras
            max_deposit_months, maintenance_included,
            // Location enhancements
            near_metro, near_college,
            // Amenities (comma separated)
            amenities
        } = req.query;

        let where = {};

        // Basic filters
        if (city) where.city = { [Op.iLike]: `%${city}%` };
        if (locality) where.locality = { [Op.iLike]: `%${locality}%` };
        if (min_price) where.price = { ...where.price, [Op.gte]: parseInt(min_price) };
        if (max_price) where.price = { ...where.price, [Op.lte]: parseInt(max_price) };
        if (property_type) where.property_type = property_type;
        if (listing_type) where.listing_type = listing_type;
        if (bedrooms) where.bedrooms = parseInt(bedrooms);
        if (status) where.status = status;
        else where.status = 'available';

        // Furnished & size
        if (furnished) where.furnished = furnished;
        if (min_size) where.size = { ...where.size, [Op.gte]: parseInt(min_size) };
        if (max_size) where.size = { ...where.size, [Op.lte]: parseInt(max_size) };

        // Lifestyle filters (booleans)
        if (pet_friendly === 'true') where.pet_friendly = true;
        if (vegetarian_only === 'true') where.vegetarian_only = true;
        if (bachelor_friendly === 'true') where.bachelor_friendly = true;
        if (bachelor_friendly === 'false') where.bachelor_friendly = false;
        if (gender_preference && gender_preference !== 'any') {
            where.gender_preference = { [Op.in]: [gender_preference, 'any'] };
        }

        // Lease duration
        if (min_lease_months) where.min_lease_months = { ...where.min_lease_months, [Op.gte]: parseInt(min_lease_months) };
        if (max_lease_months) where.min_lease_months = { ...where.min_lease_months, [Op.lte]: parseInt(max_lease_months) };

        // Deposit
        if (max_deposit_months) where.deposit_months = { [Op.lte]: parseInt(max_deposit_months) };

        // Maintenance
        if (maintenance_included === 'true') where.maintenance_included = true;

        // Availability
        if (immediate_available === 'true') {
            where.available_from = { [Op.lte]: new Date() };
        } else if (available_from) {
            where.available_from = { [Op.lte]: new Date(available_from) };
        }

        // Location enhancements
        if (near_metro === 'true') where.near_metro = true;
        if (near_college) where.near_college = { [Op.iLike]: `%${near_college}%` };

        // Amenities filter (check if amenities array contains all requested)
        if (amenities) {
            const amenitiesArr = amenities.split(',').map(a => a.trim());
            where.amenities = { [Op.contains]: amenitiesArr };
        }

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
