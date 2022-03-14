const express = require('express');
const itemController = require('../../controllers/bizObjects/itemController');
const authController = require('../../controllers/auth/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), itemController.getAllItems)
  .post(authController.protect, authController.restrictTo('cash-counter'), itemController.createItem);

router
  .route('/:itemId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter', 'sale-counter'), itemController.checkId, itemController.getItem)
  .patch(authController.protect, authController.restrictTo('cash-counter'), itemController.checkId, itemController.updateItem);
   
module.exports = router;
