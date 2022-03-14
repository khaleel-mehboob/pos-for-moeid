const db = require('../models');

exports.getOptions = Model => {
  
  let options = {};

  if(Model.name === 'department'){
    options = {include: [{association: db.departments.categories }]}

  } else if(Model.name === 'category'){
    options = {include: [{ association: db.categories.items, include: [{ association: db.items.stockLedger }] }, { association: db.categories.department }]}

  } else if(Model.name === 'account'){
    options = {include: [{ association: db.accounts.accountHead }, { association: db.accounts.accountSubHead }]};

  } else if(Model.name === 'journalEntry'){
    options = {include: [{ association: db.journalEntries.ledgerEntries, include:[{ association: db.ledgerEntries.account }] }]};

  } else if(Model.name === 'ledgerEntry'){
    options = {include: [{ association: db.ledgerEntries.journalEntry }]};

  } else if (Model.name === 'customer') {
    options = {include: [{association: db.customers.account }]};
  
  } else if (Model.name === 'supplier') {
    options = {include: [{association: db.suppliers.account }]};
  
  } else if (Model.name === 'receipt') {
    options = {include: [{association: db.receipts.customer, include: [{ association: db.customers.account }] }]};
    
  } else if (Model.name === 'payment') {
    options = {include: [{association: db.payments.supplier, include: [{ association: db.suppliers.account }] }]};
  
  } else if (Model.name === 'item') {
    options = {include: [{association: db.items.category }, {association: db.items.department }, {association: db.items.stockLedger }]};
  
  } else if (Model.name === 'stockLedger') {
    options = {include: [{ association: db.stockLedgers.item}, { association: db.stockLedgers.department}, { association: db.stockLedgers.category}, { association: db.stockLedgers.stockEntries}]};

  } else if (Model.name === 'stockLedgerEntry') {
    options = {include: [{ association: db.stockEntries.stockLedger }]};
  
  } else if (Model.name === 'sale') {
    options = {include: [{ association: db.sales.saleEntries, include: [{ association: db.saleReturnEntries.item, include:[{ association: db.items.stockLedger}] }]}]};

  } else if (Model.name === 'saleEntry') {
    options = {include: [{association: db.saleEntries.item }]};
  
  } else if (Model.name === 'saleReturn') {
    options = {include: [{association: db.saleReturns.saleReturnEntries, include: [{ association: db.saleReturnEntries.item }]}]};
  
  } else if (Model.name === 'saleReturnEntry') {
    options = {include: [{association: db.saleReturnEntries.item }]};
  
  } else if (Model.name === 'purchase') {
    options = {include: [{association: db.purchases.purchaseEntries, include: [{ association: db.purchaseEntries.item }]}, { association: db.purchases.supplier, include:[{ association: db.suppliers.account }]}]};
  
  } else if (Model.name === 'purchaseEntry') {
    options = {include: [{association: db.purchaseEntries.item }]};
  
  } else if (Model.name === 'purchaseReturn') {
    options = {include: [{association: db.purchaseReturns.purchaseReturnEntries, include: [{ association: db.purchaseReturnEntries.item}]}, { association: db.purchaseReturns.supplier, include:[{ association: db.suppliers.account }] }]};
  
  } else if (Model.name === 'purchaseReturnEntry') {
    options = {include: [{association: db.purchaseReturnEntries.item }]};
  
  } else if (Model.name === 'order') {
    options = {include: [{ association: db.orders.orderEntries, include: [{ association: db.orderEntries.item, include:[{ association: db.items.stockLedger}]}]}]};

  } else if (Model.name === 'orderEntry') {
    options = {include: [{association: db.orderEntries.item }]};
  
  } else if (Model.name === 'cashReceipt') {
    options = {include: [{association: db.cashReceipts.cashReceiptEntries, include: [{ association: db.cashReceiptEntries.sales }, { association: db.cashReceiptEntries.orders }]}]};
  
  } else if (Model.name === 'cashReceiptEntry') {
    options = {include: [{association: db.cashReceiptEntries.item }]};
  
  }  

  return options;
}

exports.setFilters = (Model, signal, features, req) => {

  const Op = db.Sequelize.Op;

  if(Model.name === 'account') {
    // accountGroup parameter is mandatory
    let { accountGroup, accountHeadId, accountSubHeadId } = req.params;
    
    features.query.where = {};

    if(accountGroup) {
      features.query.where = { accountGroup};
    }
    
    if(accountHeadId) {
      features.query.where = { accountGroup, accountHeadId };
    } 

    if(accountSubHeadId) {
      features.query.where = { accountGroup, accountHeadId, accountSubHeadId };
    }

  } else if(Model.name === 'accountHead') {
    
    const accountGroup = req.params.accountGroup;
    features.query.where = { accountGroup };

  } else if(Model.name === 'accountSubHead') {

    const accountHeadId = req.params.accountHeadId * 1;
    features.query.where = { accountHeadId };

  } else if(Model.name === 'category') {
    
    const departmentId = req.params.departmentId * 1;
    if(departmentId) {
      features.query.where = { departmentId };
    } else {
      features.query.where = {};
    }

  } else if(Model.name === 'item') {
    
    let { departmentId, categoryId } = req.params;

    if(departmentId && categoryId) {
      features.query.where = { departmentId, categoryId };

    } else if(departmentId) { 
      features.query.where = { departmentId };

    } else if(categoryId) {
      features.query.where = { categoryId };

    } else {
      features.query.where = {  };

    }
  
  } else if(Model.name === 'stockLedger') {
    
    let { itemId } = req.params;
    if(itemId)
    {
      features.query.where = { itemId };
    }
    else { 
      let { departmentId, categoryId } = req.params;

      if(departmentId && categoryId) {
        features.query.where = { departmentId, categoryId };

      } else if(departmentId) { 
        features.query.where = { departmentId };

      } else if(categoryId) {
        features.query.where = { categoryId };

      } else {
        features.query.where = {  };
      }
    }
  } else if(Model.name === 'stockEntry') {
    
    let { stockLedgerId } = req.params;
    features.query.where = { stockLedgerId };

  } else if(Model.name === 'saleEntry') {

    const saleId = req.params.saleId * 1;
    features.query.where = { saleId };

  } else if(Model.name === 'orderEntry') {

    const orderId = req.params.orderId * 1;
    features.query.where = { orderId };

  } else if(Model.name === 'journalEntry' || Model.name === 'receipt' || Model.name === 'payment' || Model.name === 'saleReturn' || Model.name === 'purchase' || Model.name === 'purchaseReturn') {

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    features.query.where = { 
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      } 
    };
  } else if(Model.name === 'cashReceipt' && signal) {

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    features.query.where = {
      paymentMode: 'Credit', 
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      } 
    };

  } else if(Model.name === 'cashReceipt') {

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    features.query.where = { 
      createdAt: { 
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      } 
    };

  } else if(Model.name === 'order' && signal) {

    features.query.where = { 
      status: {
        [Op.eq]: ['Delivered']
      } 
    };
  } else if(Model.name === 'order') {

    features.query.where = { 
      status: {
        [Op.in]: ['Booked', 'In-process', 'Ready']
      } 
    };
  } else if(Model.name === 'sale' && signal) {

    features.query.where = { 
      status: {
        [Op.eq]: ['Paid']
      } 
    };
  } else if(Model.name === 'sale') {

    features.query.where = { 
      status: {
        [Op.eq]: ['Un-paid']
      } 
    };
  }

  return features;
}