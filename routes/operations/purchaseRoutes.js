const express = require('express');
const purchaseController = require('../../controllers/operations/purchaseController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), purchaseController.getPurchases)
  .post(authController.protect, authController.restrictTo('cash-counter'), purchaseController.createPurchase)

router
  .route('/sum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), purchaseController.getPurchaseSum)

router
  .route('/count')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), purchaseController.getPurchaseCount)
  
router
  .route('/:purchaseId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), purchaseController.checkId, purchaseController.getPurchase)
  
module.exports = router;