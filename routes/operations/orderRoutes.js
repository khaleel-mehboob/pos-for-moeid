const express = require('express');
const orderController = require('../../controllers/operations/orderController');
const authController = require('../../controllers/auth/authController');

const orderEntryRouter = require('./orderEntryRoutes');
const router = express.Router();
router.use('/:orderId/orderEntries', orderEntryRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), orderController.getOrders)
  .post(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), orderController.createOrder)

router
  .route('/delivered')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), orderController.getTodaysDeliveredOrders)

router
  .route('/sum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), orderController.getOrderSum)

router
  .route('/count')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin'), orderController.getOrderCount)
  
router
  .route('/:orderId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), orderController.checkId, orderController.getOrder)
  .patch(authController.protect, authController.restrictTo('cash-counter', 'sale-counter'), orderController.checkId, orderController.updateOrder)
  
router
  .route('/:orderId/cancel')
  .patch(authController.protect, authController.restrictTo('cash-counter'), orderController.checkId, orderController.cancelOrder)

module.exports = router;