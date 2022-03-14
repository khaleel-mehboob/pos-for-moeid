const { DataTypes } = require("sequelize");
const db = require("..");

module.exports = ((sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      required: [true, 'Item Name required.'],
      unique: true,
    },
    barcode: {
      type: DataTypes.STRING,
    },
    unit: {
      type: DataTypes.ENUM(['Unit', 'KGs', 'Lbs', 'Dzn']),
      required: [true, 'Measurement Unit required.'],
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    // salesTaxRatio: {
    //   type: DataTypes.DECIMAL(10, 2),
    //   defaultValue: 0,
    // },
    // salesTaxApplication: {
    //   type: DataTypes.ENUM('Exclusive', 'Inclusive'),
    //   defaultValue: 'Exclusive',
    // },
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

  return Item;
});