const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.departments);
exports.getAllDepartments = factory.getAll(db.departments);