const express = require('express');
const categoryController = require('../../controllers/bizObjects/categoryController');
const authController = require('../../controllers/auth/authController');

const itemRouter = require('./itemRoutes');
const stockLedgerRouter = require('../../routes/inventory/stockLedgerRoutes');

const router = express.Router({ mergeParams: true });
router.use('/:categoryId/items', itemRouter)
router.use('/:categoryId/stockLedgers', stockLedgerRouter)

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), categoryController.getAllCategories)
  .post(authController.protect, authController.restrictTo('cash-counter'), categoryController.createCategory);

router
  .route('/:categoryId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), categoryController.checkId, categoryController.getCategory)
  .patch(authController.protect, authController.restrictTo('cash-counter'), categoryController.checkId, categoryController.updateCategory);

  module.exports = router;
