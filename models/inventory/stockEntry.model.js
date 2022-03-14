const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const StockLedgerEntry = sequelize.define("stockEntry", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM(['Sale', 'Sale Return', 'Purchase', 'Purchase Return', 'Order']),
      required: [true, "Entry type required"],
    },
    qty: {
      type: DataTypes.DECIMAL(10,3),
      defaultValue: 0
    },
    rate: {
      type: DataTypes.DECIMAL(10, 3),
      defaultValue: 0
    },
    updatedQty: {
      type: DataTypes.DECIMAL(10,3),
      defaultValue: 0
    },
    movingAverage: {
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
    },
    referenceId: {
      type: DataTypes.INTEGER
    }
  }, {
    // Other options to go here
    underscored: true
  });

  return StockLedgerEntry;
});