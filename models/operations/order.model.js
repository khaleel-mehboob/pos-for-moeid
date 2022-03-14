const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      required: [true, 'Amount required']
    },
    customerName: {
      type: DataTypes.TEXT,
      required: [true, 'Customer name required']
    },
    contactNo: {
      type: DataTypes.TEXT,
      required: [true, 'Contact number required']
    },
    advancePayment: {
      type: DataTypes.DECIMAL(10, 2)
    },
    remainingAmount: {
      type: DataTypes.DECIMAL(10, 2)
    },
    status: {
      type: DataTypes.ENUM('Booked', 'Cancelled', 'In-process', 'Ready', 'Delivered'),
    },
    deliveryMethod: {
      type: DataTypes.ENUM('Self-collection', 'Delivery Boy', 'Food Panda')
    },
    remarks: {
      type: DataTypes.TEXT
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

  return Order;
});