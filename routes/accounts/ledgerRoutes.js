const express = require('express');
const ledgerController = require('../../controllers/accounts/ledgerController');
const authController = require('../../controllers/auth/authController');

const router = express.Router({ mergeParams: true});

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), ledgerController.getLedger)

  module.exports = router;