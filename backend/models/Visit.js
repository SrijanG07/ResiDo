const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Visit = sequelize.define(
  "Visit",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
    },
    visitor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    visit_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    visit_time: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    visitor_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    visitor_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    visitor_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "visits",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Visit;
