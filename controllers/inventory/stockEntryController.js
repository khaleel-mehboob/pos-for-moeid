const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.stockEntries);
exports.getAllStockEntries = factory.getAll(db.stockEntries);
exports.getStockEntry = factory.getOne(db.stockEntries);
exports.createStockEntry = factory.createOne(db.stockEntries);