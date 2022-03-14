const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.receipts);
exports.getAllReceipts = factory.getAll(db.receipts);
exports.createReceipt = factory.createOne(db.receipts);
exports.getReceipt = factory.getOne(db.receipts);
exports.getReceiptSum = factory.getSum(db.receipts);
exports.getReceiptCount = factory.getCount(db.receipts);