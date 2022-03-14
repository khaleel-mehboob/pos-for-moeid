const { saleReturnEntries } = require("../../models");
const db = require("../../models");
const { sequelize } = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.sales);
exports.createSale = factory.createOperation(db.sales, db.saleEntries);
// By default getAll() returns Un-paid sales
exports.getSales = factory.getAll(db.sales);
// We will pass a flag to get today's Paid sales
exports.getTodaysPaidSales = factory.getAll(db.sales, true);
exports.getSale = factory.getOne(db.sales);
exports.updateSale = factory.updateOne(db.sales);
exports.getSaleSum = factory.getSum(db.sales);
exports.getSaleCount = factory.getCount(db.sales);