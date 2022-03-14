const db = require("../../models");
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');
const AppError = require('../../utils/appError');
const { sequelize } = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.suppliers);
exports.createSupplier = factory.createOne(db.suppliers);
exports.getSuppliers = factory.getAll(db.suppliers);
exports.getSupplier = factory.getOne(db.suppliers);
exports.updateSupplier = factory.updateOne(db.suppliers);