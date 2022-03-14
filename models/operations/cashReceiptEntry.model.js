const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const CashReceiptEntry = sequelize.define("cashReceiptEntry", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2)
    },
    // saleValue: {
    //   type: DataTypes.DECIMAL(10, 2)
    // },
    // outputSalesTaxAmount: {
    //   type: DataTypes.DECIMAL(10, 2)
    // },
    // subTotal: {
    //   type: DataTypes.INTEGER
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

  return CashReceiptEntry;
});