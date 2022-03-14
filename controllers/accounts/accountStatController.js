const db = require("../../models");
const catchAsync = require('../../utils/catchAsync');

exports.getDiscountSum = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();

  const discountAccount = await db.accounts.findOne({ where: { title: 'Sale Discount'}});

  const SUM = await db.ledgerEntries.sum('amount', {
    where: {
      // title: 'Sale Discount',
      accountId: discountAccount.id,
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
    },
  });

  res.status(200).json(
  {
    status: 'success',
    data: {
      SUM
    }
  });
});

exports.getDiscountCount = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();

  const discountAccount = await db.accounts.findOne({ where: { title: 'Sale Discount'}});
  
  const COUNT = await db.ledgerEntries.count({
    where: {
      // Sale Discount Account Id = 7
      accountId: discountAccount.id,
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
    },
  });
  
  res.status(200).json(
  {
    status: 'success',
    data: {
      COUNT
    }
  });
});

exports.getCashReceiptSum = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();

  const SUM = await db.cashReceipts.sum('netTotal', {
    where: {
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
    },
  });

  const cash = await db.cashReceipts.sum('netTotal', {
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
      paymentMode: 'Cash'
    }
  });

  const credit = await db.cashReceipts.sum('netTotal', {
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
      paymentMode: 'Credit'
    }
  });

  res.status(200).json(
  {
    status: 'success',
    data: {
      SUM,
      cash,
      credit
    }
  });
});

exports.getCashReceiptCount = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();

  const COUNT = await db.cashReceipts.count({
    where: {
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
    },
  });

  const cash = await db.cashReceipts.count({
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
      paymentMode: 'Cash'
    }
  });

  const credit = await db.cashReceipts.count({
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
      paymentMode: 'Credit'
    }
  });
  
  res.status(200).json(
  {
    status: 'success',
    data: {
      COUNT,
      cash,
      credit
    }
  });
});

exports.getDepartmentSaleSum = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();

  const SUM = await db.ledgerEntries.sum('amount', {
    where: {
      accountId: req.params.accountId,
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
    },
  });
  
  res.status(200).json(
  {
    status: 'success',
    data: {
      SUM
    }
  });
});