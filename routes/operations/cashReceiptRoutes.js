const express = require('express');
const cashReceiptController = require('../../controllers/operations/cashReceiptController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), cashReceiptController.getCashReceipts)
  .post(authController.protect, authController.restrictTo('cash-counter'), cashReceiptController.createCashReceipt)

router
  .route('/credit')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), cashReceiptController.getCreditCashReceipts)

router
  .route('/:cashReceiptId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), cashReceiptController.checkId, cashReceiptController.getCashReceipt)
  
module.exports = router;