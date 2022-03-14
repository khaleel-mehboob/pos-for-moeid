const express = require('express');
const accountHeadController = require('../../controllers/accounts/accountHeadController');
const authController = require('../../controllers/auth/authController');

const accountSubHeadRouter = require('./accountSubHeadRoutes');
const accountRouter = require('./accountRoutes');

const router = express.Router({ mergeParams: true});

router.use('/:accountHeadId/accountSubHeads', accountSubHeadRouter);
router.use('/:accountHeadId/accounts', accountRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountHeadController.getAllAccountHeads)
  .post(authController.protect, authController.restrictTo('super-admin'), accountHeadController.createAccountHead)

  router
  .route('/:accountHeadId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountHeadController.checkId, accountHeadController.getAccountHead)
  .patch(authController.protect, authController.restrictTo('super-admin'), accountHeadController.checkId, accountHeadController.updateAccountHead)

module.exports = router;