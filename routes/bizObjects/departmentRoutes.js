const express = require('express');
const departmentController = require('../../controllers/bizObjects/departmentController');
const authController = require('../../controllers/auth/authController');

const categoryRouter = require('./categoryRoutes');
const itemRouter = require('./itemRoutes');
const stockLedgerRouter = require('../../routes/inventory/stockLedgerRoutes');

const router = express.Router();

router.use('/:departmentId/categories', categoryRouter);
router.use('/:departmentId/items', itemRouter);
router.use('/:departmentId/stockLedgers', stockLedgerRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), departmentController.getAllDepartments)  

module.exports = router;