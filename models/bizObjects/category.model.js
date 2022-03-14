const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      required: [true, 'Category Name required.'],
      unique: true
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

  return Category;
});