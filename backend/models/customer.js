"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.hasMany(models.Booking, { foreignKey: "customer_id" });
    }
  }
  Customer.init(
    {
      name: DataTypes.TEXT,
      contact_no: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Customer",
      paranoid: true,
    }
  );
  return Customer;
};
