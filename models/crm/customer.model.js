const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      required: [true, 'Name required.'],
      unique: true
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

  return Customer;
});