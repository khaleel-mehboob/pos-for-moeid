const db = require("../../models");
const factory = require('../handlerFactory');
const catchAsync = require('../../utils/catchAsync')

exports.checkId = factory.checkId(db.categories);
exports.getAllCategories = factory.getAll(db.categories);
exports.createCategory = factory.createOne(db.categories);
exports.getCategory = factory.getOne(db.categories);
exports.updateCategory = factory.updateOne(db.categories);