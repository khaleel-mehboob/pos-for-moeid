const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.purchases);
exports.createPurchase = factory.createOperation(db.purchases, db.purchaseEntries);
exports.getPurchases = factory.getAll(db.purchases);
exports.getPurchase = factory.getOne(db.purchases);
exports.getPurchaseSum = factory.getSum(db.purchases);
exports.getPurchaseCount = factory.getCount(db.purchases);