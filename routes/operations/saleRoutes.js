const express = require('express');
const saleController = require('../../controllers/operations/saleController');
const authController = require('../../controllers/auth/authController');

const saleEntryRouter = require('./saleEntryRoutes');
const router = express.Router();
router.use('/:saleId/saleEntries', saleEntryRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), saleController.getSales)
  .post(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), saleController.createSale)

router
  .route('/paid')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), saleController.getTodaysPaidSales)

router
  .route('/sum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), saleController.getSaleSum)

router
  .route('/count')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), saleController.getSaleCount)

router
  .route('/:saleId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), saleController.checkId, saleController.getSale)
  .patch(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), saleController.checkId, saleController.updateSale)
  
module.exports = router;