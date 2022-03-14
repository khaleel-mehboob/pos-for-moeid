const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const LedgerEntry = sequelize.define("ledgerEntry", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entryType: {
      type: DataTypes.ENUM(['Dr', 'Cr']),
      required: [true, 'Entry Type must be defined']
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      required: [true, 'Amount required']
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2)
    },
    balanceType: {
      type: DataTypes.ENUM(['Dr', 'Cr'])
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

  return LedgerEntry;
});