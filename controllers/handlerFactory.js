const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures'); 
const db = require("../models");
const { sequelize } = require("../models");
const { getOptions, setFilters } = require('./commonHandlers');
const axios = require('axios');

let axiosOptions = {
  // Use baseUrl: 'http://localhost:2111' when on localhost
  // Use baseUrl: 'https://pos-manager-vit.herokuapp.com' when deployed on heroku
  baseURL: process.env.AXIOS_BASE_URL,
}

const getId = (Model, req) => {
  
  let id = req.params.id * 1;

  if (Model.name === 'accountHead') {
    id = req.params.accountHeadId * 1; 
  } else if (Model.name === 'accountSubHead') {
    id = req.params.accountSubHeadId * 1; 
  } else if (Model.name === 'account') {
    id = req.params.accountId * 1;
  } else if (Model.name === 'department') {
    id = req.params.departmentId * 1;
  } else if (Model.name === 'category') {
    id = req.params.categoryId * 1;
  } else if (Model.name === 'item') {
    id = req.params.itemId * 1;
  } else if (Model.name === 'stockLedger') {
    id = req.params.stockLedgerId * 1;
  } else if (Model.name === 'stockEntry') {
    id = req.params.stockEntryId * 1;
  } else if (Model.name === 'sale') {
    id = req.params.saleId * 1;
  } else if (Model.name === 'saleEntry') {
    id = req.params.saleEntryId * 1;
  } else if (Model.name === 'saleReturn') {
    id = req.params.saleReturnId * 1;
  } else if (Model.name === 'saleReturnEntry') {
    id = req.params.saleReturnEntryId * 1;
  } else if (Model.name === 'purchase') {
    id = req.params.purchaseId * 1;
  } else if (Model.name === 'purchaseEntry') {
    id = req.params.purchaseEntryId * 1;
  } else if (Model.name === 'purchaseReturn') {
    id = req.params.purchaseReturnId * 1;
  } else if (Model.name === 'purchaseReturnEntry') {
    id = req.params.purchaseReturnEntryId * 1;
  } else if (Model.name === 'order') {
    id = req.params.orderId * 1;
  } else if (Model.name === 'orderEntry') {
    id = req.params.orderEntryId * 1;
  } else if (Model.name === 'cashReceipt') {
    id = req.params.cashReceiptId * 1;
  } else if (Model.name === 'cashReceiptEntry') {
    id = req.params.cashReceiptEntryId * 1;
  } else {
    id = req.params.id * 1;
  }

  return id;
  
};

exports.checkId = Model => catchAsync(async (req, res, next, val) => {
  
  const id = getId(Model, req);

  const doc = await Model.findByPk(id);

  if(!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  next();
});

exports.getOne = Model => catchAsync(async (req, res, next) => {

  const id = getId(Model, req);
  
  // Define options based on Model
  const options = getOptions(Model); 
  
  // Find record
  const doc = await Model.findByPk(id, options);
  let customer;
  
  if(Model.name === 'cashReceipt' && doc.customerId) {
    customer = await db.customers.findByPk(doc.customerId);
  }

  
  if(!doc) {
   return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json(
    {
      status: 'success',
      data: {
        doc,
        customer
      }
    }
  );
});


// Second parameter is passed for filtering today's paid sales
// and today's delivered orders
exports.getAll = (Model, signal) => catchAsync(async (req, res, next) => {

  let features = new APIFeatures({}, req.query)
  .filter()
  .sort()
  .limitFields().paginate();

  // Set the where clause in apiFeatures
  features = setFilters(Model, signal, features, req);

  const includeOptions = getOptions(Model);
  features.query.include = includeOptions.include;

  const docs = await Model.findAll(features.query);

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

const statusCheckFailed = (Model, document) => {
  
  if(Model.name === 'sale' || Model.name === 'saleEntry') {
    
    if (document.status !== 'Un-paid') return true;
    
  } else if(Model.name === 'purchase' || Model.name === 'purchaseReturn' || Model.name === 'cashReceipt') {

    // No updation allowed
    return true;

  } else if(Model.name === 'order' || Model.name === 'orderEntry') {

    if (document.status === 'Cancelled' || document.status === 'Delivered') return true;

  }  
  
  return false;
};

exports.updateOne = Model => catchAsync(async (req, res, next) => {

  const id = getId(Model, req);
  const options = getOptions(Model);

  if(Model.name === 'item') {
    document = await Model.findByPk(id, {include: [{association: db.items.department }, {association: db.items.category }, {association: db.items.stockLedger }]});
  }
  else {
    document = await Model.findByPk(id, options);
  }
  
  // Throw error if document not found
  if(!document) {
    return next(new AppError('No document found with that ID.'));
  }
  
  // StatusCheck();
  if(statusCheckFailed(Model, document)) {
    return next(new AppError(`Can not update ${ Model.name }. STATUS : ${ document.status }`));
  }

  // TO DO 1 // Update Stock
  // TO DO 2 // Post Account Entries

  // Update fields
  let result = undefined;
  // Change field only if Model name is
  // 'Customer' or 'Supplier'
  if(Model.name === 'customer' || Model.name === 'supplier')
  {
    const { name, contactNo, address } = req.body;
    document.name = name;
    document.contactNo = contactNo;
    document.address = address;
    
    if(Model.name === 'customer') {
      document.account.title = `C - ${name}`;
    } else if (Model.name === 'supplier'){
      document.account.title = `S - ${name}`;
    }
    
    result = await sequelize.transaction(async t => {
      await document.account.save({ transaction: t, user: req.user });
      return await document.save({ transaction: t, user: req.user });
    });

  // If Model.name === 'account'
  } else if(Model.name === 'account'){
    
    const { title, accountGroup, accountHeadId, accountSubHeadId, userId, supplierId, customerId } = req.body;
    
    document.title = title;
    document.accountGroup = accountGroup;
    document.accountHeadId = accountHeadId;
    document.accountSubHeadId = accountSubHeadId;
    document.userId = userId;
    document.supplierId = supplierId;
    document.customerId = customerId;
    
    result = await document.save({ user: req.user });

  } else if(Model.name === 'accountHead'){

    const { title, accountGroup } = req.body;
    document.title = title;
    document.accountGroup = accountGroup;
    result = await document.save({ user: req.user });

  } else if(Model.name === 'accountSubHead'){

    const { title, accountHeadId } = req.body;
    document.title = title;
    document.accountHeadId = accountHeadId;
    result = await document.save({ user: req.user });

  } else if(Model.name === 'category'){
    
    const { name, departmentId} = req.body;
    document.name = name;
    document.departmentId = departmentId;

    result = await sequelize.transaction(async t => {
      document.items.forEach(async e => {
        e.departmentId = departmentId;
        e.stockLedger.departmentId = departmentId;

        await e.stockLedger.save({ transaction: t, user: req.user });
        await e.save({ transaction: t, user: req.user });
      });

      return await document.save({ transaction: t, user: req.user });
    });

    result = await document.save({ user: req.user });

  } else if(Model.name === 'item'){
    
    const { name, barcode, unit, price, departmentId, categoryId} = req.body;  
    document.name = name;
    document.barcode = barcode;
    document.unit = unit;
    document.price = price;
    document.departmentId = departmentId;
    document.categoryId = categoryId;
    document.stockLedger.title = name;
    document.stockLedger.departmentId = departmentId;
    document.stockLedger.categoryId = categoryId;


    result = await sequelize.transaction(async t => {
      await document.stockLedger.save({ transaction: t, user: req.user });

      let options = {include: [{association: db.items.category }, {association: db.items.department }]};
      return await document.save({ transaction: t, options, user: req.user });
    });

  } else if(Model.name === 'stockLedger'){
    
    const { currentQty, movingAverage, stockValue } = req.body;  
    document.currentQty = currentQty;
    document.movingAverage = movingAverage;
    document.stockValue = stockValue;

    result = await sequelize.transaction(async t => {
      return await document.save({ transaction: t, user: req.user });
    });

  } else if(Model.name === 'sale'){
      const { status } = req.body;
      document.status = status;
      result = await document.save({ user: req.user });
  } else if(Model.name === 'order'){
    const { status, customerName, contactNo, deliveryMethod, remarks } = req.body;

    if(status) document.status = status;
    if(customerName) document.customerName = customerName;
    if(contactNo) document.contactNo = contactNo;
    if(deliveryMethod) document.deliveryMethod = deliveryMethod;
    if(remarks) document.remarks = remarks;

    result = await document.save({ user: req.user });
}

  // Send result
  res.status(203).json(
    {
      status: 'success',
      data: {
        result
      }
    }
  );
});

exports.createOne = Model => catchAsync(async (req, res, next) => {

  let options = { user: req.user };

  const document = await sequelize.transaction( async (t) => {
    // set options
    if(Model.name === 'category') {
      if(!req.body.departmentId) req.body.departmentId = req.params.departmentId;

    } else if(Model.name === 'item') {
      
      if(!req.body.barcode) req.body.barcode = '';
      if(!req.body.departmentId) req.body.departmentId = req.params.departmentId;
      if(!req.body.categoryId) req.body.categoryId = req.params.categoryId;
      if(!req.body.currentQty) req.body.currentQty = 0;
      if(!req.body.movingAverage) req.body.movingAverage = 0;
      
      if(!req.body.stockLedger) req.body.stockLedger = {
        title: req.body.name, 
        currentQty: req.body.currentQty, 
        movingAverage: req.body.movingAverage,
        stockValue: req.body.currentQty * req.body.movingAverage,
        categoryId: req.body.categoryId,
        departmentId: req.body.departmentId
      }
      
      options = { transaction: t, user: req.user };
      
      let itemObj = req.body;
      let stockLedgerObj = itemObj.stockLedger;
      itemObj.stockLedger = undefined;
      
      itemObj = await Model.create(itemObj, options);
      stockLedgerObj.itemId = itemObj.id;
      
      return await db.stockLedgers.create(stockLedgerObj, options);
    
    } else if(Model.name === 'customer') {
      options = { transaction: t, user: req.user };

      if(!req.body.balance) req.body.balance = 0;

      const balance = req.body.balance * 1;
      const balanceType = 'Dr'
      if(balance < 0) balanceType ='Cr';
      
      if(!req.body.account) req.body.account = {
        title: `C - ${req.body.name}`, 
        accountGroup: 'Asset', 
        accountHeadId: 6, 
        balance,
        balanceType
      }

      let customerObj = req.body;
      let accountObj = customerObj.account;
      customerObj.account = undefined;

      customerObj = await Model.create(customerObj, options);
      accountObj.customerId = customerObj.id;

      return await db.accounts.create(accountObj, options);
    
    } else if(Model.name === 'supplier') {
      options = { transaction: t, user: req.user };

      if(!req.body.balance) req.body.balance = 0;

      const balance = req.body.balance * 1;
      const balanceType = 'Cr'
      if(balance < 0) balanceType ='Dr';

      if(!req.body.account) req.body.account = {
        title: `S - ${req.body.name}`, 
        accountGroup: 'Liability', 
        accountHeadId: 2, 
        balance,
        balanceType
      }

      let supplierObj = req.body;
      let accountObj = supplierObj.account;
      supplierObj.account = undefined;

      supplierObj = await Model.create(supplierObj, options);
      accountObj.supplierId = supplierObj.id;
      return await db.accounts.create(accountObj, options);
    
    } else if(Model.name === 'accountHead') {
      if(!req.body.accountGroup) req.body.accountGroup = req.params.accountGroup;
    
    } else if (Model.name === 'accountHead') {
      if(!req.body.accountGroup) req.body.accountGroup = req.params.accountGroup      
    
    } else if (Model.name === 'accountSubHead') {
      if(!req.body.accountHeadId) req.body.accountHeadId = req.params.accountHeadId
    
    } else if (Model.name === 'account') {
      if(!req.body.accountGroup) req.body.accountGroup = req.params.accountGroup
      if(!req.body.accountHeadId) req.body.accountHeadId = req.params.accountHeadId
      if(!req.body.accountSubHeadId) req.body.accountSubHeadId = req.params.accountSubHeadId
      if(!req.body.balance) req.body.balance = 0;

      // console.log(':::::', req.body.accountGroup, '::::::::::::::::');

      if(!req.body.balanceType) {
        if(req.body.accountGroup === 'asset' || req.body.accountGroup === 'expense') req.body.balanceType = 'Dr';
        if(req.body.accountGroup === 'liability' || req.body.accountGroup === 'revenue') req.body.balanceType = 'Cr';
      }

      return await Model.create(req.body, options);

    } else if (Model.name === 'receipt') {
      
      options = { transaction: t, user: req.user};

      const customerId = req.body.customer.id
      const amount = parseFloat(req.body.amount);
      const memo = req.body.memo;
      const customerAccountId = req.body.customer.account.id;
      const counterCashAccount = await db.accounts.findOne({ where: { userId: req.user.id }});

      const journalEntryObj = {
        entryType: 'General Entry',
        narration: `Cash received from ${req.body.customer.name}`,
        amount,
        ledgerEntries: [
            {
                entryType: 'Dr',
                amount,
                accountId: counterCashAccount.id
            },
            {
                entryType: 'Cr',
                amount,
                accountId: customerAccountId
            }
        ]
      }

      axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);

      return await Model.create({amount, customerId, memo}, options);

    } else if (Model.name === 'cashReceipt') {
      
      options = { transaction: t, user: req.user};

      const customerId = req.body.customer.id
      const amount = parseFloat(req.body.amount);
      const customerAccountId = req.body.customer.account.id;
      const counterCashAccount = await db.accounts.findOne({ where: { userId: req.user.id }});

      const journalEntryObj = {
        entryType: 'General Entry',
        narration: `Cash received from ${req.body.customer.name}`,
        amount,
        ledgerEntries: [
            {
                entryType: 'Dr',
                amount,
                accountId: counterCashAccount.id
            },
            {
                entryType: 'Cr',
                amount,
                accountId: customerAccountId
            }
        ]
      }

      axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);

      return await Model.create({amount, customerId}, options);

    } else if (Model.name === 'payment') {
      
      options = { transaction: t, user: req.user};
      
      const supplierId = req.body.supplier.id
      const amount = parseFloat(req.body.amount);
      const memo = req.body.memo;
      const supplierAccountId = req.body.supplier.account.id;
      const counterCashAccount = await db.accounts.findOne({ where: { userId: req.user.id }});

      if(!(parseFloat(counterCashAccount.balance) >= amount && counterCashAccount.balanceType === 'Dr'))
      {
        return next(new AppError(`Insufficient balance in ${counterCashAccount.title}`, 404));
      }

      const journalEntryObj = {
        entryType: 'General Entry',
        narration: `Cash paid to ${req.body.supplier.name}`,
        amount,
        ledgerEntries: [
            {
                entryType: 'Dr',
                amount,
                accountId: supplierAccountId
            },
            {
                entryType: 'Cr',
                amount,
                accountId: counterCashAccount.id
            }
        ]
      }

      axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);

      return await Model.create({amount, supplierId, memo}, options);;

    } else if (Model.name === 'stockEntry') {

      if(!req.body.stockLedgerId) req.body.stockLedgerId = req.params.stockLedgerId
      
      options = { transaction: t, user: req.user }; 
      
      // get stock ledger
      const stockLedger = await db.stockLedgers.findByPk(req.body.stockLedgerId, options);
      
      let { type, qty, rate, referenceId } = req.body;
      qty = qty * 1;
      rate = rate * 1;

      let entryObj = { type, qty, rate, referenceId};
      
      // calculate moving average
      let currentQty = stockLedger.currentQty * 1;
      let totalQty, totalSum, newAverage;
    
      // If selling or return purchase, just decrease qty
      if(type === 'Sale' || type === 'Order' || type === 'Purchase Return'){
        totalQty = currentQty - qty;
        entryObj.movingAverage = stockLedger.movingAverage;
      }

      // If selling or return purchase, just decrease qty
      if(type === 'Sale Return'){

        totalQty = currentQty + qty;
        entryObj.movingAverage = stockLedger.movingAverage;
      }
      
      // if purchase or returning sale, increase qty and calculate new moving average
      if(type === 'Purchase') {
        totalQty = currentQty + qty;
        totalSum = (currentQty * stockLedger.movingAverage) + (qty * rate);
        newAverage = totalSum / totalQty;
        // Update new Average
        stockLedger.movingAverage = newAverage;
        entryObj.movingAverage = newAverage;
      }
      
      // Update Current Qty
      stockLedger.currentQty = totalQty;
      entryObj.updatedQty = totalQty;
      entryObj.stockLedgerId = stockLedger.id;
      // Update Stock Value
      stockLedger.stockValue = stockLedger.currentQty * stockLedger.movingAverage;

      // Save stockLedger
      await stockLedger.save(options);

      // Create and return Stock Entry
      return await Model.create(entryObj, options);
    } 
    // console.log(req.body);
    // // By default we are not passing any transaction
    return await Model.create(req.body, options);
  });
  
  res.status(201).json(
    {
      status: 'success',
      data: {
        data: document
      }
    }
  );  
});

const getOperationEntries = (Model, operationObj) => {
  if(Model.name === 'sale') {
    return [...operationObj.saleEntries];
  } else if(Model.name === 'saleReturn') {
    return [...operationObj.saleReturnEntries];
  } else if(Model.name === 'purchase') {
    return [...operationObj.purchaseEntries];
  } else if(Model.name === 'purchaseReturn') {
    return [...operationObj.purchaseReturnEntries];
  } else if(Model.name === 'order') {
    return [...operationObj.orderEntries];
  } else if(Model.name === 'cashReceipt') {
    return [...operationObj.cashReceiptEntries];
  } 
}

const setOperationReference = (Model, entries, operationId) => {

  if(Model.name === 'sale') {
    entries.forEach(e => {
      e.saleId = operationId;
    });
  } else if(Model.name === 'saleReturn') {
    entries.forEach(e => {
      e.saleReturnId = operationId;
    });
  } else if(Model.name === 'purchase') {
    entries.forEach(e => {
      e.purchaseId = operationId;
    });
  } else if(Model.name === 'purchaseReturn') {
    entries.forEach(e => {
      e.purchaseReturnId = operationId;
    });
  } else if(Model.name === 'order') {
    entries.forEach(e => {
      e.orderId = operationId;
    });
  } else if(Model.name === 'cashReceipt') {
    entries.forEach(e => {
      e.cashReceiptId = operationId;
    });
  }
};

const calculateOperationAmount = (opModel, operationEntries) => {
  let amount = 0;
  
  operationEntries.forEach(e => {
    
    if(e.discount) {
      amount = amount + (e.qty * e.rate - e.discount); 
    } else {
      amount = amount + (e.qty * e.rate);
    }

  });
  return amount;
}

exports.createOperation = (Model, entryModel) => catchAsync(async (req, res, next) => {
  
  // Create Operation Object
  const operationObj = {...req.body};
  
  let result = await sequelize.transaction( async (t) => {
    // Create Operation
    const operation = await Model.create(operationObj, { transaction: t, user: req.user });
    
    // Get Operation Entries from Operation Entry Object
    const operationEntries = getOperationEntries(Model, operationObj);

    // Set parent reference`
    setOperationReference(Model, operationEntries, operation.id);
    
    await entryModel.bulkCreate(operationEntries, {individualHooks: true, transaction: t, user: req.user});

    // Update Operation Object
    operation.amount = calculateOperationAmount(Model, operationEntries);

    if(Model.name === 'purchase') {

      const { supplierId } = req.body;

      let supplier = await db.suppliers.findOne({ where: { id: supplierId }});

      const supplierAccount = await db.accounts.findOne({ where: { supplierId }});
      let amount = operation.amount;
      let ledgerEntries = [];

      // Credit Entry
      ledgerEntries.push({
        entryType: "Cr",
        amount,
        accountId: supplierAccount.id
      });

      const Op = db.Sequelize.Op;

      let purchaseAccounts = await db.accounts.findAll({ where: { title: { [Op.endsWith]: ' - Purchases' }}});

      axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

      for(let i = 0; i < operationEntries.length; i++) {
        let item = await db.items.findByPk(operationEntries[i].itemId, {include: [{association: db.items.department}, {association: db.items.stockLedger}]});

        let stockEntry = {
          type: "Purchase",
          qty: operationEntries[i].qty,
          rate: operationEntries[i].rate,
          referenceId: operation.id
        }

        await axios.post(`/api/v1/stockLedgers/${item.stockLedger.id}/stockEntries`, stockEntry, axiosOptions);

        for(let j = 0; j < purchaseAccounts.length; j++)
        {
          if(purchaseAccounts[j].title.startsWith(`${item.department.title}`)) {

            ledgerEntries.push({
              entryType: "Dr",
              amount: operationEntries[i].qty * operationEntries[i].rate,
              accountId: purchaseAccounts[j].id
            });

            break;
          }
        }
      }

      const journalEntryObj = {
        entryType: "General Entry",
        narration: `Purchased goods on Credit from Supplier ${supplier.name}`,
        amount,
        ledgerEntries
      }
      
      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);

      return await operation.save({ transaction: t, user: req.user });
    }

    if(Model.name === 'purchaseReturn') {

      const { supplierId } = req.body;

      let supplier = await db.suppliers.findOne({ where: { id: supplierId }});

      const supplierAccount = await db.accounts.findOne({ where: { supplierId }});
      let amount = operation.amount;
      let ledgerEntries = [];

      // Credit Entry
      ledgerEntries.push({
        entryType: "Dr",
        amount,
        accountId: supplierAccount.id
      });

      const Op = db.Sequelize.Op;

      let purchaseReturnAccounts = await db.accounts.findAll({ where: { title: { [Op.endsWith]: ' - Purchase Returns' }}});

      axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

      for(let i = 0; i < operationEntries.length; i++) {
        let item = await db.items.findByPk(operationEntries[i].itemId, {include: [{association: db.items.department}, {association: db.items.stockLedger}]});

        let stockEntry = {
          type: "Purchase Return",
          qty: operationEntries[i].qty,
          rate: operationEntries[i].rate,
          referenceId: operation.id
        }

        await axios.post(`/api/v1/stockLedgers/${item.stockLedger.id}/stockEntries`, stockEntry, axiosOptions);

        for(let j = 0; j < purchaseReturnAccounts.length; j++)
        {
          if(purchaseReturnAccounts[j].title.startsWith(`${item.department.title}`)) {

            ledgerEntries.push({
              entryType: "Cr",
              amount: operationEntries[i].qty * operationEntries[i].rate,
              accountId: purchaseReturnAccounts[j].id
            });

            break;
          }
        }
      }

      const journalEntryObj = {
        entryType: "General Entry",
        narration: `Returned Goods to Supplier ${supplier.name}`,
        amount,
        ledgerEntries
      }
      
      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);

      return await operation.save({ transaction: t, user: req.user });
    }

    if(Model.name === 'saleReturn') {
     
      const counterCashAccount = await db.accounts.findOne({ where: { userId: req.user.id }});
      let amount = parseFloat(operation.amount);

      if(!(parseFloat(counterCashAccount.balance) >= amount && counterCashAccount.balanceType === 'Dr'))
      {
        t.rollback();
        return next(new AppError(`Insufficient balance in ${counterCashAccount.title}`, 404));
      }

      let ledgerEntries = [];

      // Credit Entry
      ledgerEntries.push({
        entryType: "Cr",
        amount,
        accountId: counterCashAccount.id
      });

      const Op = db.Sequelize.Op;

      let saleReturnAccounts = await db.accounts.findAll({ where: { title: { [Op.endsWith]: ' - Sale Returns' }}});

      axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

      for(let i = 0; i < operationEntries.length; i++) {
        let item = await db.items.findByPk(operationEntries[i].itemId, {include: [{association: db.items.department}, {association: db.items.stockLedger}]});

        let stockEntry = {
          type: "Sale Return",
          qty: operationEntries[i].qty,
          rate: operationEntries[i].rate,
          referenceId: operation.id
        }

        await axios.post(`/api/v1/stockLedgers/${item.stockLedger.id}/stockEntries`, stockEntry, axiosOptions);

        for(let j = 0; j < saleReturnAccounts.length; j++)
        {
          if(saleReturnAccounts[j].title.startsWith(`${item.department.title}`)) {

            ledgerEntries.push({
              entryType: "Dr",
              amount: operationEntries[i].qty * operationEntries[i].rate,
              accountId: saleReturnAccounts[j].id
            });

            break;
          }
        }
      }

      const journalEntryObj = {
        entryType: "General Entry",
        narration: `Paid Cash on Sale Return Id: ${operation.id}`,
        amount,
        ledgerEntries
      }
      
      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);

      return await operation.save({ transaction: t, user: req.user });
    };

    if(Model.name === 'order') {
      operation.remainingAmount = operation.amount - operation.advancePayment;

      let amount = parseFloat(operation.advancePayment);

      if(amount > 0) {
        
        const counterCashAccount = await db.accounts.findOne({ where: { userId: req.user.id }});
        const liabilityAccount = await db.accounts.findOne({ where: { title: 'Advance Received against Orders' } });

        const journalEntryObj = {
          entryType: "General Entry",
          narration: `Received advance payment against Order Id: ${operation.id}`,
          amount,
          ledgerEntries: [
              {
                  entryType: "Dr",
                  amount,
                  accountId: counterCashAccount.id
              },
              {
                  entryType: "Cr",
                  amount,
                  accountId: liabilityAccount.id
              }
          ]
        }

        axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

        await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);
      }
      return await operation.save({ transaction: t, user: req.user });
    };

    if(Model.name === 'cashReceipt') {

      axiosOptions.headers = { Authorization: `Bearer ${req.cookies.jwt}` }

      let ledgerEntries = [];

      let debitAccountId = '';
      if(req.body.paymentMode === 'Cash') {
        const counterCashAccount = await db.accounts.findOne({ where: { userId: req.user.id }});
        debitAccountId = counterCashAccount.id;
      }

      if(req.body.paymentMode === 'Credit') {
        debitAccountId = req.body.paymentData.customer.account.id;
      }

      // Debit Entry
      ledgerEntries.push({
        entryType: "Dr",
        amount: operation.netTotal,
        accountId: debitAccountId
      });

      if(operation.discount > 0) {
        const saleDiscountAccount = await db.accounts.findOne({ where: { title: 'Sale Discount' }});

        ledgerEntries.push({
          entryType: "Dr",
          amount: operation.discount,
          accountId: saleDiscountAccount.id
        });
      }

      const Op = db.Sequelize.Op;
      let saleAccounts = await db.accounts.findAll({ where: { title: { [Op.endsWith]: ' - Sales' }}});

      let journalEntryObj;
      // Collect data for financial and stock entries
      // Perform financial and stock entry
      // and update sale / order status
      for(let i = 0; i < operationEntries.length; i++) {
        
        // Update sale / order status
        let entry;
        let entries;
        let type = '';
        let referenceId = '';

        if(operationEntries[i].type === 'sales') {
          entry = await db.sales.findByPk(operationEntries[i].saleId, { include: [{ association: db.sales.saleEntries}]});
          entry.status = 'Paid';
          entries = entry.saleEntries;
          type = 'Sale';
          referenceId = entry.id;
        }
        
        if(operationEntries[i].type === 'orders') {
          entry = await db.orders.findByPk(operationEntries[i].orderId, { include: [{ association: db.orders.orderEntries}]});
          entry.status = 'Delivered';
          entries = entry.orderEntries;
          type = 'Order';
          referenceId = entry.id;

          if(entry.advancePayment > 0) {
            const liabilityAccount = await db.accounts.findOne({ where: { title: 'Advance Received against Orders' } });
            ledgerEntries.push({
              entryType: "Dr",
              amount: entry.advancePayment,
              accountId: liabilityAccount.id
            });
          }
        }
        // Update order / sale status
        await entry.save({transaction: t, user: req.user});

        // Loop through sale or order entries
        for(let j = 0; j < entries.length; j++) {
          let item = await db.items.findByPk(entries[j].itemId, {include: [{association: db.items.department}, {association: db.items.stockLedger}]});

          
          // Collect stock entry data
          let stockEntry = {
            type,
            qty: entries[j].qty,
            rate: entries[j].rate,
            referenceId
          }

          // Post stock entry
          await axios.post(`/api/v1/stockLedgers/${item.stockLedger.id}/stockEntries`, stockEntry, axiosOptions);

          for(let k = 0; k < saleAccounts.length; k++)
          {
            if(saleAccounts[k].title.startsWith(`${item.department.title}`)) {

              // Collect data for financial entry
              ledgerEntries.push({
                entryType: "Cr",
                amount: entries[j].qty * entries[j].rate,
                accountId: saleAccounts[k].id
              });

              break;
            }
          }
        }

        let narration = '';
        if(req.body.paymentMode === 'Cash') narration = `Received cash against Cash Receipt Id: ${operation.id}`;
        if(req.body.paymentMode === 'Credit') narration = `Cash receivable against Cash Receipt Id: ${operation.id}`;

        journalEntryObj = {
          entryType: "General Entry",
          narration,
          amount: operation.totalAmount,
          ledgerEntries
        }        
      }

      // console.log(journalEntryObj);

      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);
      return await operation.save({ transaction: t, user: req.user });
    };

    return await operation.save({ transaction: t, user: req.user });
  });

  res.status(200).json(
  {
    status: 'success',
    message: `${Model.name} created succussfuly...`,
    data: result
  });  
});

const calculateEntryAmount = entry => {
  if(entry.discount) {
    return entry.qty * entry.rate - entry.discount;
  }

  return entry.qty * entry.rate;
}

const setEntryReference = (Model, operationEntryObj, req) => {
  if(Model.name === 'saleEntry') {
    operationEntryObj.saleId = req.params.saleId;

  } else if(Model.name === 'saleReturnEntry') {
    operationEntryObj.saleReturnId = req.params.saleReturnId;

  } else if(Model.name === 'purchaseEntry') {
    operationEntryObj.purchaseId = req.params.purchaseId;

  } else if(Model.name === 'purchaseReturnEntry') {
    operationEntryObj.purchaseReturnId = req.params.purchaseReturnId;

  } else if(Model.name === 'orderEntry') {
    operationEntryObj.orderId = req.params.orderId;

  } else if(Model.name === 'cashReceiptEntry') {
    operationEntryObj.cashReceiptId = req.params.cashReceiptId;
  }

  return operationEntryObj;
}

const getOperationIdParam = (ParentModel, req) => {
  if(ParentModel.name === 'sale') {
    return req.params.saleId;
  } else if(ParentModel.name === 'saleReturn') {
    return req.params.saleReturnId;
  } else if(ParentModel.name === 'purchase') {
    return req.params.purchaseId;
  } else if(ParentModel.name === 'purchaseReturn') {
    return req.params.purchaseReturnId;
  } else if(ParentModel.name === 'order') {
    return req.params.orderId;
  } else if(ParentModel.name === 'cashReceipt') {
    return req.params.cashReceiptId;
  }
};

exports.createOperationEntry = (Model, ParentModel) => catchAsync(async (req, res, next) => {
  
  
  let operationEntryObj = {...req.body};
  
  const result = await sequelize.transaction( async (t) => {
    // Get Parent Operation to update different field
    const id = getOperationIdParam(ParentModel, req, req);
    const operation = await ParentModel.findByPk(id);
    
    // StatusCheck();
    if(statusCheckFailed(Model, operation)) {
      return next(new AppError(`Can not create ${ Model.name }, ${ ParentModel.name } is ${ operation.status }`));
    }
    
    // Set related Parent ID on an Entry
    setEntryReference(Model, operationEntryObj, req);

    // Create child entry
    // console.log(Model.name, ParentModel.name);
    const operationEntry = await Model.create(operationEntryObj, { transaction: t, user: req.user });      

    // Update Operation
    const amount = calculateEntryAmount(operationEntryObj);
    operation.amount = operation.amount * 1 + amount;
    if(Model.name === 'orderEntry') {
      operation.remainingAmount = operation.amount - (operation.advancePayment * 1);
    }
    await operation.save({ transaction: t, user: req.user });

    return operationEntry;

  });

  res.status(201).json(
    {
      status: 'success',
      message: `${ Model.name } created and ${ ParentModel.name } updated successfuly...`,
      data: result
    }
    );  
  });
 
const getEntryIdParam = (Model, req) => {

  if(Model.name === 'saleEntry') {
    return req.params.saleEntryId;
  } else if(Model.name === 'saleReturnEntry') {
    return req.params.saleReturnEntryId;
  } else if(Model.name === 'purchaseEntry') {
    return req.params.purchaseEntryId;
  } else if(Model.name === 'purchaseReturnEntry') {
    return req.params.purchaseReturnEntryId;
  } else if(Model.name === 'orderEntry') {
    return req.params.orderEntryId;
  } else if(Model.name === 'cashReceiptEntry') {
    return req.params.cashReceiptEntryId;
  }
};

exports.updateOperationEntry = (Model, ParentModel) => catchAsync(async (req, res, next) => {
  
  let opEntryObj = {...req.body};
  let entryId = getEntryIdParam(Model, req, req);

  setEntryReference(Model, opEntryObj, req);
  
  const result = await sequelize.transaction( async (t) => {
    const options = { transaction: t, user: req.user };

    const entry = await Model.findByPk(entryId, options);
    
    if(!entry) {
      return next(new AppError(`Invalid ${ Model.name } Id`));
    }

    const id = getOperationIdParam(ParentModel, req);
    const operation = await ParentModel.findByPk(id, options);
    
    // StatusCheck();
    if(statusCheckFailed(Model, operation)) {
      return next(new AppError(`Can not update ${ Model.name }, ${ ParentModel.name } is ${ operation.status }`));
    }
    
    // Decrement previous amount
    const previousAmount = calculateEntryAmount(entry);
    operation.decrement('amount', { by: previousAmount});
    if(Model.name === 'orderEntry') {
      operation.decrement('remainingAmount', { by: previousAmount});
    }
    
    // Increment new amount
    const newAmount = calculateEntryAmount(opEntryObj)
    operation.increment('amount', { by: newAmount});
    if(Model.name === 'orderEntry') {
      operation.increment('remainingAmount', { by: newAmount});
    }
    await operation.save(options);
    
    // Update entry
    entry.qty = opEntryObj.qty;
    entry.rate = opEntryObj.rate;
    await entry.save(options);

    return entry;
  });

  res.status(200).json(
  {
    status: 'success',
    message: `${ Model.name } and ${ ParentModel.name } updated successfuly...`,
    data: result
  });  
});

exports.deleteOperationEntry = (Model, ParentModel) => catchAsync(async (req, res, next) => {
  
  let entryId = getEntryIdParam(Model, req);
  
  const result = await sequelize.transaction( async (t) => {
    
    const options = { transaction: t, user: req.user };
    
    const entry = await Model.findByPk(entryId, options); 
    
    if(!entry) {
      return next(new AppError(`Invalid ${ Model.name } ID`));
    }
    
    // Get Operation
    const id = getOperationIdParam(ParentModel, req);
    const operation = await ParentModel.findByPk(id, options);
    
    // StatusCheck();
    if(statusCheckFailed(Model, operation)) {
      return next(new AppError(`Can not delete ${ Model.name }, ${ ParentModel.name } is ${ operation.status }`));
    }

    // Get entry amount
    const amount = calculateEntryAmount(entry);
    // delete entry
    await Model.destroy({ where: { id: entryId } }, options);
    
    // Update
    operation.decrement('amount', { by: amount});
    if(Model.name === 'orderEntry') {
      operation.decrement('remainingAmount', { by: amount});
    }
    await operation.save(options);

    return
  });

  res.status(204).json(
    {
      status: 'success',
      message: `${ Model.name } deleted and ${ ParentModel.name } updated successfuly...`,
      data: null
    }
  );  
});

exports.getSum = Model => catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  let where = {
    createdAt: { 
      [Op.gt]: TODAY_START,
      [Op.lt]: NOW
    }
  };

  if(Model.name === 'order') {
    where = {
      status: 'Delivered',
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      }
    }
  }

  if(Model.name === 'sale') {
    where = {
      status: 'Paid',
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      }
    }
  }

  const SUM = await Model.sum('amount', { where });

  res.status(200).json(
    {
      status: 'success',
      data: {
        SUM
      }
    }
  );

});

exports.getCount = Model => catchAsync(async (req, res, next) => {

  const Op = db.Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  let where = {
    createdAt: { 
      [Op.gt]: TODAY_START,
      [Op.lt]: NOW
    },
  };

  if(Model.name === 'order') {
    where = {
      status: 'Delivered',
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
    };
  }

  if(Model.name === 'sale') {
    where = {
      status: 'Paid',
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
    };
  }

  const COUNT = await Model.count({ where });

  res.status(200).json(
    {
      status: 'success',
      data: {
        COUNT
      }
    }
  );
});