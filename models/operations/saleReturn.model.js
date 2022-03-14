const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const SaleReturn = sequelize.define("saleReturn", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      required: [true, 'Amount required']
    }, 
    // saleReturnValue: {
    //   type: DataTypes.DECIMAL(10,2)
    // },
    // outputTaxAmount: {
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

  return SaleReturn;
});