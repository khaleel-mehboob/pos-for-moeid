const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.customers);
exports.createCustomer = factory.createOne(db.customers);
exports.getCustomers = factory.getAll(db.customers);
exports.getCustomer = factory.getOne(db.customers);
exports.updateCustomer = factory.updateOne(db.customers);