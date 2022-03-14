const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const OrderEntry = sequelize.define("orderEntry", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    qty: {
      type: DataTypes.DECIMAL(10, 2),
      min: 1
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      required: [true, 'Rate required.']
    },
    // saleValue: {
    //   type: DataTypes.DECIMAL(10, 2)
    // },
    // outputSalesTaxAmount: {
    //   type: DataTypes.DECIMAL(10, 2)
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

  return OrderEntry;
});