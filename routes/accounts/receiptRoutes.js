const express = require('express');
const receiptController = require('../../controllers/accounts/receiptController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), receiptController.getAllReceipts)
  .post(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), receiptController.createReceipt)

router
  .route('/sum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), receiptController.getReceiptSum)

router
  .route('/count')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), receiptController.getReceiptCount)

router
  .route('/:id')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), receiptController.checkId, receiptController.getReceipt)
  
module.exports = router;