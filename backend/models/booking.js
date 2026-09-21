"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Room, { foreignKey: "room_id" });
      Booking.belongsTo(models.Customer, { foreignKey: "customer_id" });
      Booking.hasMany(models.Payment, { foreignKey: "booking_id" });
      Booking.hasMany(models.Feedback, { foreignKey: "booking_id" });
    }
  }
  Booking.init(
    {
      reference_number: { type: DataTypes.STRING, unique: true, allowNull: false },
      room_id: DataTypes.INTEGER,
      customer_id: DataTypes.INTEGER,
      date_in: DataTypes.DATE,
      date_out: DataTypes.DATE,
      status: DataTypes.ENUM(
        "pending",
        "confirmed",
        "cancelled",
        "checked_in",
        "checked_out"
      ),
    },
    {
      sequelize,
      modelName: "Booking",
      paranoid: true,
    }
  );
  return Booking;
};
