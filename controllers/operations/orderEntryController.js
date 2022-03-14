const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.orderEntries);
exports.createOrderEntry = factory.createOperationEntry(db.orderEntries, db.orders);
exports.getOrderEntries = factory.getAll(db.orderEntries);
exports.getOrderEntry = factory.getOne(db.orderEntries);
exports.updateOrderEntry = factory.updateOperationEntry(db.orderEntries, db.orders)
exports.deleteOrderEntry = factory.deleteOperationEntry(db.orderEntries, db.orders);