const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(viewsController.getLogin);

router
  .route('/dashboard')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'sale-counter', 'cash-counter'), viewsController.getDashboard);

router
  .route('/receiveCounterCash')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getReceiveCounterCash);

router
  .route('/payCashToCounter')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getPayCashToCounter);

router
  .route('/withdrawCash')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('admin'), viewsController.getWithdrawCash);


router
.route('/categories')
.get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.getCategories);

router
.route('/categories/create')
.get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getCategoryForm);

// router
// .route('/categories/:id/show')
// .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.showCategory);

router
.route('/categories/:id/edit')
.get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.editCategory);

router
.route('/categories/:id/items')
.get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.getItemsByCategory);

router
.route('/items')
.get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.getItems);

router
.route('/items/create')
.get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getItemForm);

// router
// .route('/items/:id/show')
// .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.showItem);

router
.route('/items/:id/edit')
.get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.editItem);

router
  .route('/customers')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getCustomers);

router
  .route('/customers/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getCustomerForm);

router
  .route('/customers/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.showCustomer);
  
router
  .route('/customers/:id/edit')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.editCustomer);

router
  .route('/suppliers')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getSuppliers);

router
  .route('/suppliers/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getSupplierForm);

router
  .route('/suppliers/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.showSupplier);
  
router
  .route('/suppliers/:id/edit')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.editSupplier);

router
  .route('/stockLedgers')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.getStockRegister);

router
  .route('/stockLedgers/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.getStockLedger);

router
  .route('/stockLedgers/:id/edit')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.editStockLedger);

router
  .route('/coa')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getChartOfAccounts);

router
  .route('/coa/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getAccountForm);

router
  .route('/accounts/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getAccountLedger);

router
  .route('/journal')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin'), viewsController.getJournal);

router
  .route('/journal/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin'), viewsController.getJournalEntryForm);

  router
  .route('/journal/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin'), viewsController.getJournalEntry);

router
  .route('/receipts')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getReceipts);

router
  .route('/receipts/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getReceiptForm);

router
  .route('/receipts/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getReceipt);

router
  .route('/payments')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getPayments);

router
  .route('/payments/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getPaymentForm);

router
  .route('/payments/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getPayment);

router
  .route('/cashReceipts')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getCashReceipts);

router
  .route('/cashReceipts/credit')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getCreditCashReceipts);

router
  .route('/cashReceipts/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getCashReceiptForm);

router
  .route('/cashReceipts/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getCashReceipt);

router
  .route('/orders')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.getOrders);

router
  .route('/orders/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter', 'sale-counter'), viewsController.getOrderForm);

router
  .route('/orders/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.showOrder);

router
  .route('/orders/:id/edit')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter', 'sale-counter'), viewsController.editOrder);

router
  .route('/orders/:id/cancel')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.cancelOrder);

router
  .route('/sales')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.getSales);

router
  .route('/sales/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter', 'sale-counter'), viewsController.getSaleForm);

router
  .route('/sales/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), viewsController.showSale);

router
  .route('/sales/:id/edit')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter', 'sale-counter'), viewsController.editSale);
 
router
  .route('/saleReturns')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getSaleReturns);

router
  .route('/saleReturns/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getSaleReturnForm);

router
  .route('/saleReturns/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.showSaleReturn);

router
  .route('/purchases')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getPurchases);

router
  .route('/purchases/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getPurchaseForm);
 
router
  .route('/purchases/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.showPurchase);

router
  .route('/purchaseReturns')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.getPurchaseReturns);

router
  .route('/purchaseReturns/create')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('cash-counter'), viewsController.getPurchaseReturnForm);

router
  .route('/purchaseReturns/:id/show')
  .get(authController.protect, authController.isLoggedIn, authController.restrictTo('super-admin', 'admin', 'cash-counter'), viewsController.showPurchaseReturn);

module.exports = router;