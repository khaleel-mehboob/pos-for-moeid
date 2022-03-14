const db = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.stockLedgers);
exports.getStockLedgers = factory.getAll(db.stockLedgers);
exports.getStockLedger = factory.getOne(db.stockLedgers);
exports.updateStockLedger = factory.updateOne(db.stockLedgers);
exports.getStockValue = catchAsync(async (req, res, next) => {

  const SUM = await db.stockLedgers.sum('stockValue');

  res.status(200).json(
  {
    status: 'success',
    data: {
      SUM
    }
  });
});