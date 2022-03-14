const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.accountSubHeads);
exports.getAllAccountSubHeads = factory.getAll(db.accountSubHeads);
exports.createAccountSubHead = factory.createOne(db.accountSubHeads);
exports.getAccountSubHead = factory.getOne(db.accountSubHeads);
exports.updateAccountSubHead = factory.updateOne(db.accountSubHeads);