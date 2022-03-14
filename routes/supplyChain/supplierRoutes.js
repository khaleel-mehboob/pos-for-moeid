const express = require('express');
const supplierController = require('../../controllers/supplyChain/supplierController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), supplierController.getSuppliers)
  .post(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), supplierController.createSupplier);

router
  .route('/:id')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), supplierController.checkId, supplierController.getSupplier)
  .patch(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), supplierController.checkId, supplierController.updateSupplier);

  module.exports = router;
