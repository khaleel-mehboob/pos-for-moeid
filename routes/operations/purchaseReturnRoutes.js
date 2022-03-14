const express = require('express');
const purchaseReturnController = require('../../controllers/operations/purchaseReturnController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), purchaseReturnController.getPurchaseReturns)
  .post(authController.protect, authController.restrictTo('cash-counter'), purchaseReturnController.createPurchaseReturn)

router
  .route('/sum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), purchaseReturnController.getPurchaseReturnSum)

router
  .route('/count')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), purchaseReturnController.getPurchaseReturnCount)

router
  .route('/:purchaseReturnId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), purchaseReturnController.checkId, purchaseReturnController.getPurchaseReturn)
  
module.exports = router;