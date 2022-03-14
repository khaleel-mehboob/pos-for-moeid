const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const AccountHead = sequelize.define("accountHead", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      required: [true, 'An Account Head must have a Title'],
      unique: true,
      trim: true
    },
    accountGroup: {
      type: DataTypes.ENUM('Asset', 'Liability', 'Revenue', 'Expense'),
      required: [true, 'An account Head must have an Account Group']
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

  return AccountHead;
});