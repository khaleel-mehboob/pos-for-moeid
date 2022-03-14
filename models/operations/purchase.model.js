const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const Purchase = sequelize.define("purchase", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      required: [true, 'Amount required']
    },
    // purchaseValue: {
    //   type: DataTypes.DECIMAL(10,2)
    // },
    // inputTaxAmount: {
    //   type: DataTypes.DECIMAL(10,2)
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

  return Purchase;
});