const express = require('express');
const stockEntryController = require('../../controllers/inventory/stockEntryController');
const stockLedgerController = require('../../controllers/inventory/stockLedgerController');
const authController = require('../../controllers/auth/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), stockLedgerController.checkId, stockEntryController.getAllStockEntries)
  .post(authController.protect, authController.restrictTo('cash-counter'), stockLedgerController.checkId, stockEntryController.createStockEntry);

router
  .route('/:stockEntryId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), stockEntryController.checkId, stockEntryController.getStockEntry)

module.exports = router;