const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.payments);
exports.getAllPayments = factory.getAll(db.payments);
exports.createPayment = factory.createOne(db.payments);
exports.getPayment = factory.getOne(db.payments);
exports.getPaymentSum = factory.getSum(db.payments);
exports.getPaymentCount = factory.getCount(db.payments);