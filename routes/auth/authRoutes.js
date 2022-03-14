const express = require('express');
const catchAsync = require('../../utils/catchAsync');

const authController = require('../../controllers/auth/authController');

const router = express.Router();


router
  .route('/login')
  .post(authController.login);

router
  .route('/logout')
  .get(authController.logout);

module.exports = router;
