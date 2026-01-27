const sequelize = require('../config/database');
const User = require('./User');
const Property = require('./Property');
const Image = require('./Image');
const Inquiry = require('./Inquiry');

// Define associations
User.hasMany(Property, { foreignKey: 'owner_id', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

Property.hasMany(Image, { foreignKey: 'property_id', as: 'images', onDelete: 'CASCADE' });
Image.belongsTo(Property, { foreignKey: 'property_id' });

Property.hasMany(Inquiry, { foreignKey: 'property_id', as: 'inquiries', onDelete: 'CASCADE' });
Inquiry.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

User.hasMany(Inquiry, { foreignKey: 'sender_id', as: 'sent_inquiries' });
Inquiry.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

module.exports = {
    sequelize,
    User,
    Property,
    Image,
    Inquiry
};
