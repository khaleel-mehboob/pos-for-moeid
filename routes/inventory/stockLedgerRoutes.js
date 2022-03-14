const express = require('express');
const stockLedgerController = require('../../controllers/inventory/stockLedgerController');
const authController = require('../../controllers/auth/authController');

const stockEntryRouter = require('../inventory/stockEntryRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:stockLedgerId/stockEntries', stockEntryRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), stockLedgerController.getStockLedgers)

router
  .route('/stockValue')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), stockLedgerController.getStockValue)

router
  .route('/:stockLedgerId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), stockLedgerController.checkId, stockLedgerController.getStockLedger)
  .patch(authController.protect, authController.restrictTo('cash-counter'), stockLedgerController.checkId, stockLedgerController.updateStockLedger)

module.exports = router;