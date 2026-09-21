"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomCategory.hasMany(models.Room, { foreignKey: "category_id" });
    }
  }
  RoomCategory.init(
    {
      category_name: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "RoomCategory",
      paranoid: true,
    }
  );
  return RoomCategory;
};
