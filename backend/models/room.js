"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsTo(models.RoomCategory, { foreignKey: "category_id" });
      Room.hasMany(models.Booking, { foreignKey: "room_id" });
    }
  }
  Room.init(
    {
      room_name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      status: DataTypes.ENUM("available", "occupied", "maintenance"),
    },
    {
      sequelize,
      modelName: "Room",
      paranoid: true,
    }
  );
  return Room;
};
