const express = require('express');
const userController = require('../../controllers/auth/userController');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin'), userController.getAllUsers)
  .post(authController.protect, authController.restrictTo('super-admin'), userController.createUser);

router
  .route('/:id/toggleStatus')
  .patch(authController.protect, authController.restrictTo('super-admin'), userController.checkId, userController.toggleStatus)
  
router
  .route('/:id/changePassword')
  .patch(authController.protect, authController.restrictTo('super-admin'), userController.checkId, userController.changePassword)

  module.exports = router;
