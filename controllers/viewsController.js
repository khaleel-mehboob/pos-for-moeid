const catchAsync = require('../utils/catchAsync');
const db = require("../models");
const APIFeatures = require('../utils/apiFeatures');
const { getOptions, setFilters } = require('./commonHandlers');
const axios = require('axios').default;

let dataOptions = {
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  clientName: process.env.CLIENT_NAME
};


let axiosOptions = {
  // Use baseUrl: 'http://localhost:2111' when on localhost
  // Use baseUrl: 'https://pos-manager-vit.herokuapp.com' when deployed on heroku
  baseURL: process.env.AXIOS_BASE_URL
}

const setJWTTokenOnAxios = token => {
  axiosOptions.headers = { Authorization: `Bearer ${token}` };
}

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login', dataOptions);
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  
  if (req.user.userRole === 'sale-counter') {
    module.exports.getSaleForm(req, res, next);

  } else if (req.user.userRole === 'cash-counter') {
    module.exports.getCashReceiptForm(req, res, next);

  } else if (req.user.userRole === 'super-admin' || req.user.userRole === 'admin') {

    setJWTTokenOnAxios(req.cookies.jwt);
    let response = await axios.get('/api/v1/orders/sum', axiosOptions);
    dataOptions.orderSum = response.data.data.SUM;

    response = await axios.get('/api/v1/orders/count', axiosOptions);
    dataOptions.orderCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/sales/sum', axiosOptions);
    dataOptions.saleSum = response.data.data.SUM;

    response = await axios.get('/api/v1/sales/count', axiosOptions);
    dataOptions.saleCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/purchases/sum', axiosOptions);
    dataOptions.purchaseSum = response.data.data.SUM;

    response = await axios.get('/api/v1/purchases/count', axiosOptions);
    dataOptions.purchaseCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/saleReturns/sum', axiosOptions);
    dataOptions.saleReturnSum = response.data.data.SUM;

    response = await axios.get('/api/v1/saleReturns/count', axiosOptions);
    dataOptions.saleReturnCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/purchaseReturns/sum', axiosOptions);
    dataOptions.purchaseReturnSum = response.data.data.SUM;

    response = await axios.get('/api/v1/purchaseReturns/count', axiosOptions);
    dataOptions.purchaseReturnCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/receipts/sum', axiosOptions);
    dataOptions.receiptSum = response.data.data.SUM;

    response = await axios.get('/api/v1/receipts/count', axiosOptions);
    dataOptions.receiptCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/payments/sum', axiosOptions);
    dataOptions.paymentSum = response.data.data.SUM;

    response = await axios.get('/api/v1/payments/count', axiosOptions);
    dataOptions.paymentCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/accountStats/discountSum', axiosOptions);
    dataOptions.discountSum = response.data.data.SUM;

    response = await axios.get('/api/v1/accountStats/discountCount', axiosOptions);
    dataOptions.discountCount = response.data.data.COUNT;

    response = await axios.get('/api/v1/accountStats/cashReceiptSum', axiosOptions);
    dataOptions.cashReceiptSum = response.data.data.SUM;
    dataOptions.cashReceiptCash = response.data.data.cash;
    dataOptions.cashReceiptCredit = response.data.data.credit;

    response = await axios.get('/api/v1/accountStats/cashReceiptCount', axiosOptions);
    dataOptions.cashReceiptCount = response.data.data.COUNT;
    dataOptions.cashReceiptCashCount = response.data.data.cash;
    dataOptions.cashReceiptCreditCount = response.data.data.credit;

    res.status(200).render('dashboards/admin', dataOptions);

  }
});


exports.getReceiveCounterCash = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/accountStats/cashAccounts?limit=2', axiosOptions);
  dataOptions.cashAccounts = response.data.data.data;
  res.status(200).render('dashboards/receiveCounterCash', dataOptions);
});

exports.getPayCashToCounter = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/accountStats/cashAccounts?limit=2', axiosOptions);
  dataOptions.cashAccounts = response.data.data.data;
  res.status(200).render('dashboards/payCashToCounter', dataOptions);
});

exports.getWithdrawCash = catchAsync(async (req, res, next) => {
  res.status(200).render('dashboards/withdrawCash', dataOptions);
});


const getFeaturesObject = (query) => {
  return new APIFeatures({}, query)
  .filter()
  .sort()
  .limitFields().paginate();
}

exports.getCategories = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/categories?limit=500', axiosOptions);
  dataOptions.categories = response.data.data.data;
  res.status(200).render('bizObjects/categories/index', dataOptions);

});

exports.getCategoryForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/departments', axiosOptions);
  dataOptions.departments = response.data.data.data;
  res.status(200).render('bizObjects/categories/create', dataOptions);

});

// exports.showCategory = catchAsync(async (req, res, next) => {
//   setJWTTokenOnAxios(req.cookies.jwt);
//   const response = await axios.get(`/api/v1/categories/${req.params.id}`, axiosOptions);
//   dataOptions.category = response.data.data.doc;
//   res.status(200).render('bizObjects/categories/show', dataOptions);

// });

exports.editCategory = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get(`/api/v1/categories/${req.params.id}`, axiosOptions);
  dataOptions.category = response.data.data.doc;

  response = await axios.get('/api/v1/departments', axiosOptions);
  dataOptions.departments = response.data.data.data;

  res.status(200).render('bizObjects/categories/edit', dataOptions);
});

exports.getItemsByCategory = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/categories/${req.params.id}/items?limit=2500`, axiosOptions);
  dataOptions.items = response.data.data.data;
  res.status(200).render('bizObjects/items/index', dataOptions);

});

exports.getItems = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/items?limit=2500', axiosOptions);
  dataOptions.items = response.data.data.data;
  res.status(200).render('bizObjects/items/index', dataOptions);

});

exports.getItemForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/departments', axiosOptions);
  dataOptions.departments = response.data.data.data;
  res.status(200).render('bizObjects/items/create', dataOptions);

});

// exports.showItem = catchAsync(async (req, res, next) => {
//   setJWTTokenOnAxios(req.cookies.jwt);
//   const response = await axios.get(`/api/v1/items/${req.params.id}`, axiosOptions);
//   dataOptions.item = response.data.data.doc;
//   res.status(200).render('bizObjects/items/show', dataOptions);

// });

exports.editItem = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get(`/api/v1/items/${req.params.id}`, axiosOptions);
  dataOptions.item = response.data.data.doc;

  response = await axios.get('/api/v1/departments', axiosOptions);
  dataOptions.departments = response.data.data.data;

  response = await axios.get(`/api/v1/departments/${dataOptions.item.department.id}/categories`, axiosOptions);
  dataOptions.categories = response.data.data.data;

  res.status(200).render('bizObjects/items/edit', dataOptions);
});


exports.getCustomers = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/customers?limit=1000', axiosOptions);
  dataOptions.customers = response.data.data.data;
  res.status(200).render('bizObjects/customers/index', dataOptions);
});

exports.getCustomerForm = catchAsync(async (req, res, next) => {
  res.status(200).render('bizObjects/customers/create', dataOptions);

});

exports.showCustomer = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/customers/${req.params.id}`, axiosOptions);
  dataOptions.customer = response.data.data.doc;
  res.status(200).render('bizObjects/customers/show', dataOptions);

});

exports.editCustomer = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get(`/api/v1/customers/${req.params.id}`, axiosOptions);
  dataOptions.customer = response.data.data.doc;

  res.status(200).render('bizObjects/customers/edit', dataOptions);
});

exports.getSuppliers = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/suppliers?limit=1000', axiosOptions);
  dataOptions.suppliers = response.data.data.data;
  res.status(200).render('bizObjects/suppliers/index', dataOptions);
});

exports.getSupplierForm = catchAsync(async (req, res, next) => {
  res.status(200).render('bizObjects/suppliers/create', dataOptions);

});

exports.showSupplier = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/suppliers/${req.params.id}`, axiosOptions);
  dataOptions.supplier = response.data.data.doc;
  res.status(200).render('bizObjects/suppliers/show', dataOptions);

});

exports.editSupplier = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get(`/api/v1/suppliers/${req.params.id}`, axiosOptions);
  dataOptions.supplier = response.data.data.doc;

  res.status(200).render('bizObjects/suppliers/edit', dataOptions);
});

exports.getStockRegister = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/stockLedgers?limit=5000', axiosOptions);
  dataOptions.stockLedgers = response.data.data.data;

  response = await axios.get('/api/v1/stockLedgers/stockValue', axiosOptions);
  dataOptions.stockValue = response.data.data.SUM;

  res.status(200).render('stockLedgers/index', dataOptions);
});

exports.getStockLedger = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/stockLedgers/${req.params.id}`, axiosOptions);
  dataOptions.stockLedger = response.data.data.doc;
  res.status(200).render('stockLedgers/show', dataOptions);
});

exports.editStockLedger = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/stockLedgers/${req.params.id}`, axiosOptions);
  dataOptions.stockLedger = response.data.data.doc;
  res.status(200).render('stockLedgers/edit', dataOptions);
});

exports.getChartOfAccounts = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/accounts?limit=500', axiosOptions);
  dataOptions.accounts = response.data.data.data;
  res.status(200).render('accounts/chartOfAccounts/index', dataOptions);
});

exports.getAccountForm = catchAsync(async (req, res, next) => {
  res.status(200).render('accounts/chartOfAccounts/create', dataOptions);
});

exports.getAccountLedger = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get(`/api/v1/accounts/${req.params.id}`, axiosOptions);
  dataOptions.accountLedger = response.data.data.doc;

  response = await axios.get(`/api/v1/accounts/${req.params.id}/ledger?limit=50000`, axiosOptions);

  if(response.data.status === 'success')
  {
    dataOptions.accountLedger.ledgerEntries = response.data.ledgerEntries;
  }

  res.status(200).render('accounts/chartOfAccounts/show', dataOptions);
});

exports.getJournal = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/journal?limit=50000', axiosOptions);
  dataOptions.journalEntries = response.data.data.data;
  res.status(200).render('accounts/journal/index', dataOptions);
});

exports.getJournalEntry = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/journal/${req.params.id}`, axiosOptions);
  dataOptions.journalEntry = response.data.data.doc;
  res.status(200).render('accounts/journal/show', dataOptions);
});

exports.getJournalEntryForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/accounts?limit=500', axiosOptions);
  if(response.data.status === 'success')
    dataOptions.accounts = response.data.data.data;
    
  res.status(200).render('accounts/journal/create', dataOptions);
});

exports.getReceipts = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/receipts?limit=1000', axiosOptions);
  dataOptions.receipts = response.data.data.data;
  res.status(200).render('accounts/receipts/index', dataOptions);
});

exports.getReceiptForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/customers?limit=5000', axiosOptions);
  dataOptions.customers = response.data.data.data;
  res.status(200).render('accounts/receipts/create', dataOptions);
});

exports.getReceipt = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/receipts/${req.params.id}`, axiosOptions);
  dataOptions.receipt = response.data.data.doc;
  res.status(200).render('accounts/receipts/show', dataOptions);
});

exports.getPayments = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/payments?limit=1000', axiosOptions);
  dataOptions.payments = response.data.data.data;
  res.status(200).render('accounts/payments/index', dataOptions);
});

exports.getPaymentForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/suppliers?limit=1000', axiosOptions);
  dataOptions.suppliers = response.data.data.data;
  res.status(200).render('accounts/payments/create', dataOptions);
});

exports.getPayment = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/payments/${req.params.id}`, axiosOptions);
  dataOptions.payment = response.data.data.doc;
  res.status(200).render('accounts/payments/show', dataOptions);
});

exports.getCashReceipts = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/cashReceipts?limit=10000', axiosOptions);
  dataOptions.cashReceipts = response.data.data.data;
  res.status(200).render('operations/cashReceipts/index', dataOptions);
});

exports.getCreditCashReceipts = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/cashReceipts/credit?limit=10000', axiosOptions);
  dataOptions.cashReceipts = response.data.data.data;
  res.status(200).render('operations/cashReceipts/index', dataOptions);
});

exports.getCashReceiptForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/orders', axiosOptions);
  dataOptions.orders = response.data.data.data;

  response = await axios.get('/api/v1/sales', axiosOptions);
  dataOptions.sales = response.data.data.data;

  response = await axios.get('/api/v1/customers?limit=1000', axiosOptions);
  dataOptions.customers = response.data.data.data;
  res.status(200).render('operations/cashReceipts/create', dataOptions);
});

exports.getCashReceipt = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/cashReceipts/${req.params.id}`, axiosOptions);
  dataOptions.cashReceipt = response.data.data.doc;
  if(response.data.data.customer) {
    dataOptions.customer = response.data.data.customer;
  }

  res.status(200).render(`operations/cashReceipts/show`, dataOptions);
});

exports.getOrders = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);

  if(req.user.userRole === 'sale-counter') {
    response = await axios.get('/api/v1/orders?limit=10000', axiosOptions);
  } else {
    response = await axios.get('/api/v1/orders/delivered?limit=10000', axiosOptions);
  }
  
  dataOptions.orders = response.data.data.data;
  res.status(200).render('operations/orders/index', dataOptions);
});

exports.getOrderForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/items?limit=5000', axiosOptions);
  dataOptions.items = response.data.data.data;
  res.status(200).render('operations/orders/create', dataOptions);
});

exports.showOrder = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/orders/${req.params.id}`, axiosOptions);
  dataOptions.order = response.data.data.doc;
  res.status(200).render('operations/orders/show', dataOptions);

});

exports.editOrder = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/items?limit=5000', axiosOptions);
  dataOptions.items = response.data.data.data;

  res.status(200).render('operations/orders/edit', dataOptions);
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/orders/${req.params.id}`, axiosOptions);
  dataOptions.order = response.data.data.doc;
  res.status(200).render('operations/orders/cancel', dataOptions);

});

exports.getSales = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);

  let response;
  if(req.user.userRole === 'sale-counter') {
    response = await axios.get('/api/v1/sales?limit=10000', axiosOptions);
  } else {
    response = await axios.get('/api/v1/sales/paid?limit=10000', axiosOptions);
  }
  dataOptions.sales = response.data.data.data;
  res.status(200).render('operations/sales/index', dataOptions);
});

exports.getSaleForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/items?limit=5000', axiosOptions);
  dataOptions.items = response.data.data.data;
  res.status(200).render('operations/sales/create', dataOptions);
});

exports.showSale = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/sales/${req.params.id}`, axiosOptions);
  dataOptions.sale = response.data.data.doc;
  res.status(200).render('operations/sales/show', dataOptions);

});

exports.editSale = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/items?limit=5000', axiosOptions);
  dataOptions.items = response.data.data.data;
  
  res.status(200).render('operations/sales/edit', dataOptions);
});

exports.getSaleReturns = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/saleReturns?limit=1000', axiosOptions);
  dataOptions.saleReturns = response.data.data.data;
  res.status(200).render('operations/saleReturns/index', dataOptions);
});

exports.getSaleReturnForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/items?limit=5000', axiosOptions);
  dataOptions.items = response.data.data.data;
  res.status(200).render('operations/saleReturns/create', dataOptions);
});

exports.showSaleReturn = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/saleReturns/${req.params.id}`, axiosOptions);
  dataOptions.saleReturn = response.data.data.doc;
  res.status(200).render('operations/saleReturns/show', dataOptions);

});

exports.getPurchases = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/purchases?limit=1000', axiosOptions);
  dataOptions.purchases = response.data.data.data;
  res.status(200).render('operations/purchases/index', dataOptions);
});

exports.getPurchaseForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/items?limit=5000', axiosOptions);
  dataOptions.items = response.data.data.data;

  response = await axios.get('/api/v1/suppliers?limit=5000', axiosOptions);
  dataOptions.suppliers = response.data.data.data;

  res.status(200).render('operations/purchases/create', dataOptions);
});

exports.showPurchase = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/purchases/${req.params.id}`, axiosOptions);
  dataOptions.purchase = response.data.data.doc;
  res.status(200).render('operations/purchases/show', dataOptions);

});

exports.getPurchaseReturns = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get('/api/v1/purchaseReturns?limit=1000', axiosOptions);
  dataOptions.purchaseReturns = response.data.data.data;
  res.status(200).render('operations/purchaseReturns/index', dataOptions);
});

exports.getPurchaseReturnForm = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  let response = await axios.get('/api/v1/items?limit=5000', axiosOptions);
  dataOptions.items = response.data.data.data;

  response = await axios.get('/api/v1/suppliers?limit=5000', axiosOptions);
  dataOptions.suppliers = response.data.data.data;

  res.status(200).render('operations/purchaseReturns/create', dataOptions);
});

exports.showPurchaseReturn = catchAsync(async (req, res, next) => {
  setJWTTokenOnAxios(req.cookies.jwt);
  const response = await axios.get(`/api/v1/purchaseReturns/${req.params.id}`, axiosOptions);
  dataOptions.purchaseReturn = response.data.data.doc;
  res.status(200).render('operations/purchaseReturns/show', dataOptions);

});

exports.getIndex = catchAsync(async (req, res, next) => {
  res.status(200).render('index', dataOptions);

});