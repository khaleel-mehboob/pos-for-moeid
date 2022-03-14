const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const Supplier = sequelize.define("supplier", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      required: [true, 'Supplier Name required.'],
      unique: true,
      trim: true
    },
    contactNo: {
      type: DataTypes.STRING,
      unique: true
    },
    address: {
      type: DataTypes.STRING
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

  return Supplier;
});