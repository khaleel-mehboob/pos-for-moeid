const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.saleEntries);
exports.createSaleEntry = factory.createOperationEntry(db.saleEntries, db.sales);
exports.getSaleEntries = factory.getAll(db.saleEntries);
exports.getSaleEntry = factory.getOne(db.saleEntries);
exports.updateSaleEntry = factory.updateOperationEntry(db.saleEntries, db.sales)
exports.deleteSaleEntry = factory.deleteOperationEntry(db.saleEntries, db.sales);