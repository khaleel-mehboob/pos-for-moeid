const express = require('express');
const saleEntryController = require('../../controllers/operations/saleEntryController');
const authController = require('../../controllers/auth/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), saleEntryController.getSaleEntries)
  .post(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), saleEntryController.createSaleEntry)

router
  .route('/:saleEntryId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), saleEntryController.checkId, saleEntryController.getSaleEntry)
  .patch(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), saleEntryController.checkId, saleEntryController.updateSaleEntry)
  .delete(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), saleEntryController.checkId, saleEntryController.deleteSaleEntry)
  
module.exports = router;