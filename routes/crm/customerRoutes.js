const express = require('express');
const customerController = require('../../controllers/crm/customerController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), customerController.getCustomers)
  .post(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), customerController.createCustomer);

router
  .route('/:id')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), customerController.checkId, customerController.getCustomer)
  .patch(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), customerController.checkId, customerController.updateCustomer);

  module.exports = router;
