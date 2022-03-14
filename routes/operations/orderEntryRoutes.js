const express = require('express');
const orderEntryController = require('../../controllers/operations/orderEntryController');
const authController = require('../../controllers/auth/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), orderEntryController.getOrderEntries)
  .post(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), orderEntryController.createOrderEntry)

router
  .route('/:orderEntryId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), orderEntryController.checkId, orderEntryController.getOrderEntry)
  .patch(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), orderEntryController.checkId, orderEntryController.updateOrderEntry)
  .delete(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), orderEntryController.checkId, orderEntryController.deleteOrderEntry)
  
module.exports = router;