const express = require('express');
const accountController = require('../../controllers/accounts/accountController');
const authController = require('../../controllers/auth/authController');

const ledgerRouter = require('./ledgerRoutes');

const router = express.Router({ mergeParams: true});
router.use('/:accountId/ledger', ledgerRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.getAllAccounts)
  .post(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.createAccount);

router
  .route('/:accountId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.checkId, accountController.getAccount)
  .patch(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountController.checkId, accountController.updateAccount);
 
module.exports = router;