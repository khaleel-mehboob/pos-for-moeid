const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.purchaseReturns);
exports.createPurchaseReturn = factory.createOperation(db.purchaseReturns, db.purchaseReturnEntries);
exports.getPurchaseReturns = factory.getAll(db.purchaseReturns);
exports.getPurchaseReturn = factory.getOne(db.purchaseReturns);
exports.getPurchaseReturnSum = factory.getSum(db.purchaseReturns);
exports.getPurchaseReturnCount = factory.getCount(db.purchaseReturns);