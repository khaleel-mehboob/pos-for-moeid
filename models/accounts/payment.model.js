const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const Payment = sequelize.define("payment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      required: [true, 'Amount required']
    },
    memo: {
      type: DataTypes.TEXT
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
  
  return Payment;
});