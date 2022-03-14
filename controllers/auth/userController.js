const db = require("../../models");
const bcrypt = require('bcryptjs');
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');
const Sequelize = require('sequelize');
const factory = require('../handlerFactory');

const Op = Sequelize.Op;

exports.checkId = factory.checkId(db.users);
exports.createUser = factory.createOne(db.users);
exports.getAllUsers = factory.getAll(db.users);

exports.toggleStatus = catchAsync(async (req, res, next) => {
  const id = req.params.id * 1;

  const user = await db.users.findByPk(id);

  if (user.status === 'active') {
    user.status = 'in-active';
  } else if (user.status === 'in-active'){
    user.status = 'active';
  }
  
  await user.save({ user: req.user });

  res.status(201).json(
    {
      status: 'success',
      message: `Status updated successfully!`
    }
  );
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const id = req.params.id * 1;
  const { password } = req.body;
  
  const user = await db.users.findByPk(id);

  user.password = await bcrypt.hash(password, 12);
  
  await user.save({ user: req.user });

  res.status(201).json(
    {
      status: 'success',
      msg: `Password updated successfully!`
    }
  );
});