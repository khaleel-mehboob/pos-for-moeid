const express = require('express');
const paymentController = require('../../controllers/accounts/paymentController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), paymentController.getAllPayments)
  .post(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), paymentController.createPayment)

router
  .route('/sum')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), paymentController.getPaymentSum)

router
  .route('/count')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), paymentController.getPaymentCount)

router
  .route('/:id')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), paymentController.checkId, paymentController.getPayment)
  
module.exports = router;