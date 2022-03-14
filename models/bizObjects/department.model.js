const { DataTypes } = require("sequelize");
const CategoryModel = require('./category.model');
const ItemModel = require('./item.model');

module.exports = ((sequelize, Sequelize) => {
  const Department = sequelize.define("department", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      required: [true, 'Department must be Titled'],
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

  // Adding a class level method
  // User.classLevelMethod = function() {
  //   return 'foo';
  // };

  // Adding an instance level method
  
  return Department;
});