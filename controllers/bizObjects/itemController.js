const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.items);
exports.getAllItems = factory.getAll(db.items);
exports.createItem = factory.createOne(db.items);
exports.getItem = factory.getOne(db.items);
exports.updateItem = factory.updateOne(db.items);