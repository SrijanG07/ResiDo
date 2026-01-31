const sequelize = require("../config/database");
const User = require("./User");
const Property = require("./Property");
const Image = require("./Image");
const Inquiry = require("./Inquiry");
const SavedSearch = require("./SavedSearch");
const Message = require("./Message");
const Review = require("./Review");
const Wishlist = require("./Wishlist");
const ChatSession = require("./ChatSession");
const ChatMessage = require("./ChatMessage");
const UserSession = require("./UserSession");
const UserActivityLog = require("./UserActivityLog");
const UserPreferences = require("./UserPreferences");
const Visit = require("./Visit");

// Define associations
User.hasMany(Property, { foreignKey: "owner_id", as: "properties" });
Property.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

Property.hasMany(Image, {
  foreignKey: "property_id",
  as: "images",
  onDelete: "CASCADE",
});
Image.belongsTo(Property, { foreignKey: "property_id" });

Property.hasMany(Inquiry, {
  foreignKey: "property_id",
  as: "inquiries",
  onDelete: "CASCADE",
});
Inquiry.belongsTo(Property, { foreignKey: "property_id", as: "property" });

User.hasMany(Inquiry, { foreignKey: "sender_id", as: "sent_inquiries" });
Inquiry.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

// Saved searches association
User.hasMany(SavedSearch, {
  foreignKey: "user_id",
  as: "saved_searches",
  onDelete: "CASCADE",
});
SavedSearch.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Message associations
Inquiry.hasMany(Message, {
  foreignKey: "inquiry_id",
  as: "messages",
  onDelete: "CASCADE",
});
Message.belongsTo(Inquiry, { foreignKey: "inquiry_id", as: "inquiry" });
User.hasMany(Message, { foreignKey: "sender_id", as: "sent_messages" });
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

// Review associations
Property.hasMany(Review, {
  foreignKey: "property_id",
  as: "reviews",
  onDelete: "CASCADE",
});
Review.belongsTo(Property, { foreignKey: "property_id", as: "property" });
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "user_id", as: "reviewer" });

// Wishlist associations
User.hasMany(Wishlist, {
  foreignKey: "user_id",
  as: "wishlist",
  onDelete: "CASCADE",
});
Wishlist.belongsTo(User, { foreignKey: "user_id", as: "user" });
Property.hasMany(Wishlist, {
  foreignKey: "property_id",
  as: "wishlisted_by",
  onDelete: "CASCADE",
});
Wishlist.belongsTo(Property, { foreignKey: "property_id", as: "property" });

// Chat associations
User.hasMany(ChatSession, {
  foreignKey: "user_id",
  as: "chat_sessions",
  onDelete: "SET NULL",
});
ChatSession.belongsTo(User, { foreignKey: "user_id", as: "user" });
ChatSession.hasMany(ChatMessage, {
  foreignKey: "session_id",
  as: "messages",
  onDelete: "CASCADE",
});
ChatMessage.belongsTo(ChatSession, { foreignKey: "session_id", as: "session" });

// User sessions and preferences associations
User.hasMany(UserSession, {
  foreignKey: "user_id",
  as: "sessions",
  onDelete: "CASCADE",
});
UserSession.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasOne(UserPreferences, {
  foreignKey: "user_id",
  as: "preferences",
  onDelete: "CASCADE",
});
UserPreferences.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(UserActivityLog, {
  foreignKey: "user_id",
  as: "activity_logs",
  onDelete: "SET NULL",
});
UserActivityLog.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Visit associations
User.hasMany(Visit, {
  foreignKey: "visitor_id",
  as: "scheduled_visits",
  onDelete: "CASCADE",
});
Visit.belongsTo(User, { foreignKey: "visitor_id", as: "visitor" });
User.hasMany(Visit, {
  foreignKey: "owner_id",
  as: "received_visits",
  onDelete: "CASCADE",
});
Visit.belongsTo(User, { foreignKey: "owner_id", as: "owner" });
Property.hasMany(Visit, {
  foreignKey: "property_id",
  as: "visits",
  onDelete: "CASCADE",
});
Visit.belongsTo(Property, { foreignKey: "property_id", as: "property" });

module.exports = {
  sequelize,
  User,
  Property,
  Image,
  Inquiry,
  SavedSearch,
  Message,
  Review,
  Wishlist,
  ChatSession,
  ChatMessage,
  UserSession,
  UserActivityLog,
  UserPreferences,
  Visit,
};
