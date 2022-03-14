const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.cashReceipts);
exports.createCashReceipt = factory.createOperation(db.cashReceipts, db.cashReceiptEntries);
exports.getCashReceipts = factory.getAll(db.cashReceipts);
exports.getCreditCashReceipts = factory.getAll(db.cashReceipts, true);
exports.getCashReceipt = factory.getOne(db.cashReceipts);