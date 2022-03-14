const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const AccountSubHead = sequelize.define("accountSubHead", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      required: [true, 'An Account Sub-Head must have a Title'],
      unique: true,
      trim: true
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

  return AccountSubHead;
});