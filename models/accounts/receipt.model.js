const { DataTypes } = require("sequelize");
const db = require("../");
const axios = require('axios').default;

module.exports = ((sequelize, Sequelize) => {
  const Receipt = sequelize.define("receipt", {
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
  
  return Receipt;
});