const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const CashReceipt = sequelize.define("cashReceipt", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      required: [true, 'Amount required']
    },
    // saleValue: {
    //   type: DataTypes.DECIMAL(10, 2)
    // },
    // outputSalesTaxAmount: {
    //   type: DataTypes.DECIMAL(10, 2)
    // },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    netTotal: {
      type: DataTypes.DECIMAL(10, 2),
      required: [true, 'Net Total required']
    },
    paymentMode: {
      type: DataTypes.ENUM('Cash', 'Credit'),
    },
    customerId: {
      type: DataTypes.INTEGER
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      required: [true, 'Paid Amount required']
    },
    balancePaid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
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
  
  return CashReceipt;
});