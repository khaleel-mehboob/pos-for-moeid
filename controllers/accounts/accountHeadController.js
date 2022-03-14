const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.accountHeads);

exports.getAllAccountHeads = factory.getAll(db.accountHeads);
exports.createAccountHead = factory.createOne(db.accountHeads);
exports.getAccountHead = factory.getOne(db.accountHeads);
exports.updateAccountHead = factory.updateOne(db.accountHeads);