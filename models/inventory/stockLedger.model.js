const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const StockLedger = sequelize.define("stockLedger", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    currentQty: {
      type: DataTypes.DECIMAL(10,3),
      defaultValue: 0
    },
    movingAverage: {
      type: DataTypes.DECIMAL(10,3),
      defaultValue: 0
    },
    stockValue: {
      type: DataTypes.DECIMAL(10,3),
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

  return StockLedger;
});