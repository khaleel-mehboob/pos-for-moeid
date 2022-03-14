const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const PurchaseReturnEntry = sequelize.define("purchaseReturnEntry", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    qty: {
      type: DataTypes.DECIMAL(10, 3),
      min: 1
    },
    rate: {
      type: DataTypes.DECIMAL(10, 3),
      required: [true, 'Rate required.']
    },
    // purchaseReturnValue: {
    //   type: DataTypes.DECIMAL(10, 2),
    // },
    // inputTaxAmount: {
    //   type: DataTypes.DECIMAL(10, 2),
    // },
    createdBy: {
      type: DataTypes.INTEGER,
      defaultValue: -1
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      defaultValue: -1
    }
  }, {
    // Other options to go here
    underscored: true
  });

  return PurchaseReturnEntry;
});