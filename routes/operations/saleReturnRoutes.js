const express = require('express');
const saleReturnController = require('../../controllers/operations/saleReturnController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), saleReturnController.getSaleReturns)
  .post(authController.protect, authController.restrictTo('cash-counter'), saleReturnController.createSaleReturn)

router
  .route('/sum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), saleReturnController.getSaleReturnSum)

router
  .route('/count')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), saleReturnController.getSaleReturnCount)

router
  .route('/:saleReturnId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), saleReturnController.checkId, saleReturnController.getSaleReturn)
  
module.exports = router;
