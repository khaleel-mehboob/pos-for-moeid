const { DataTypes } = require("sequelize");

const dom = {};

module.exports = ((sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      required: [true, 'An account must have a Title'],
      unique: true,
      trim: true
    },
    accountGroup: {
      type: DataTypes.ENUM('Asset', 'Liability', 'Revenue', 'Expense'),
      required: [true, 'Account must have an Account Group']
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
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

  return Account;
});