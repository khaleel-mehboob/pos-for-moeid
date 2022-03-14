const express = require('express');
const accountStatController = require('../../controllers/accounts/accountStatController');
const accountController = require('../../controllers/accounts/accountController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/discountSum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountStatController.getDiscountSum)

router
  .route('/discountCount')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountStatController.getDiscountCount)


router
  .route('/departmentSale/:accountId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountStatController.getDepartmentSaleSum)

router
  .route('/cashReceiptSum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountStatController.getCashReceiptSum)

router
  .route('/cashReceiptCount')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountStatController.getCashReceiptCount)

router
  .route('/cashAccounts')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountController.getCashAccounts)

router
  .route('/mainCashAccount')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountController.getMainCashAccount)

router
  .route('/drawingsAccount')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), accountController.getDrawingsAccount)

router
  .route('/discountAccount')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getDiscountAccount)

// router
//   .route('/counter1Cash')
//   .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getCounter1CashAccount)

// router
//   .route('/counter2Cash')
//   .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getCounter2CashAccount)

router
  .route('/customerAccount/:id')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getCustomerAccount)

router
  .route('/supplierAccount/:id')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getSupplierAccount)

router
  .route('/departmentalSaleAccounts')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getDepartmentalSaleAccounts)

router
  .route('/departmentalSaleReturnAccounts')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getDepartmentalSaleReturnAccounts)

router
  .route('/departmentalPurchaseAccounts')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getDepartmentalPurchaseAccounts)

router
  .route('/departmentalPurchaseReturnAccounts')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getDepartmentalPurchaseReturnAccounts)

module.exports = router;