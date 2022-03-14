const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.saleReturns);
exports.createSaleReturn = factory.createOperation(db.saleReturns, db.saleReturnEntries);
exports.getSaleReturns = factory.getAll(db.saleReturns);
exports.getSaleReturn = factory.getOne(db.saleReturns);
exports.getSaleReturnSum = factory.getSum(db.saleReturns);
exports.getSaleReturnCount = factory.getCount(db.saleReturns);
