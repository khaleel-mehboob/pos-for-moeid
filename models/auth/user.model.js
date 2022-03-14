const { DataTypes } = require("sequelize");
const bcrypt = require('bcryptjs');
const AppError = require("../../utils/appError");
const catchAsync = require('../../utils/catchAsync');

module.exports = ((sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      required: [true, 'Provide a username'],
      unique: true
    },
    userRole: {
      type: DataTypes.ENUM('super-admin', 'admin', 'cash-counter', 'sale-counter'),
      required: [true, 'Provide a user role.']
    },
    password: {
      type: DataTypes.STRING,
      required: [true, 'Provide a password']
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      required: [true, 'Provide a password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        customValidator(el){
          if(el !== this.password)
          {
            throw new AppError('Passwords are not the same');
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'in-active'),
      required: true
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
    underscored: true
  });

  User.beforeBulkCreate(async (users, options) => {
    for(const user of users) {
      user.password = await bcrypt.hash(user.password, 12);
      user.passwordConfirm = undefined;
    }
  });

  return User;
});
