const db = require("../../models");
const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../handlerFactory');
const commonHandlers = require('../commonHandlers');

exports.checkId = factory.checkId(db.accounts);

exports.getAllAccounts = factory.getAll(db.accounts);
exports.createAccount = factory.createOne(db.accounts); 
exports.getAccount = factory.getOne(db.accounts);
exports.updateAccount = factory.updateOne(db.accounts);




exports.getCashAccounts = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: {
      [Op.in]: ['Counter 1 Cash', 'Counter 2 Cash']
    }
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Documents not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        results: docs.length,
        data: docs
      }
    });
  }
});

exports.getMainCashAccount = catchAsync(async (req, res, next) => {
  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: 'Main Cash'
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Document not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        doc: docs[0]
      }
    });
  }
});

exports.getDrawingsAccount = catchAsync(async (req, res, next) => {
  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: 'Drawings Account'
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Document not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        doc: docs[0]
      }
    });
  }
});

exports.getDiscountAccount = catchAsync(async (req, res, next) => {
  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: 'Sale Discount'
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Document not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        doc: docs[0]
      }
    });
  }
});

exports.getCounter1CashAccount = catchAsync(async (req, res, next) => {
  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: 'Counter 1 Cash'
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Document not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        doc: docs[0]
      }
    });
  }
});

exports.getCounter2CashAccount = catchAsync(async (req, res, next) => {
  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: 'Counter 2 Cash'
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Document not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        doc: docs[0]
      }
    });
  }
});

exports.getCustomerAccount = catchAsync(async (req, res, next) => {
  const Op = db.Sequelize.Op;

  const customerId = re.params.id;

  let features = new APIFeatures({}, req.query)
  // .filter()
  // // .sort()
  // .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    customerId
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Document not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        doc: docs[0]
      }
    });
  }
});

exports.getSupplierAccount = catchAsync(async (req, res, next) => {
  const Op = db.Sequelize.Op;

  const supplierId = re.params.id;

  let features = new APIFeatures({}, req.query)
  .filter()
  .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    supplierId
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Document not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        doc: docs[0]
      }
    });
  }
});

exports.getDepartmentalSaleAccounts = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: {
      [Op.endsWith]: ' - Sales'
    }
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Documents not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        results: docs.length,
        data: docs
      }
    });
  }
});

exports.getDepartmentalSaleReturnAccounts = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: {
      [Op.endsWith]: ' - Sale Returns'
    }
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Documents not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        results: docs.length,
        data: docs
      }
    });
  }
});

exports.getDepartmentalPurchaseAccounts = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: {
      [Op.endsWith]: ' - Purchases'
    }
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Documents not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        results: docs.length,
        data: docs
      }
    });
  }
});

exports.getDepartmentalPurchaseReturnAccounts = catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;

  let features = new APIFeatures({}, req.query)
  .filter()
  // .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features.query.where = {
    title: {
      [Op.endsWith]: ' - Purchase Returns'
    }
  };

  const docs = await db.accounts.findAll(features.query);

  if(!docs) {
    res.status(404).json({
      status: 'fail',
      message: 'Documents not found.'
    });
  } else {
    res.status(200).json(
    {
      status: 'success',
      data: {
        results: docs.length,
        data: docs
      }
    });
  }
});