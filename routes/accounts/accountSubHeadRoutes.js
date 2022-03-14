const express = require('express');
const accountSubHeadController = require('../../controllers/accounts/accountSubHeadController');
const authController = require('../../controllers/auth/authController');

const accountRouter = require('./accountRoutes');

const router = express.Router({ mergeParams: true});
router.use('/:accountSubHeadId/accounts', accountRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountSubHeadController.getAllAccountSubHeads)
  .post(authController.protect, authController.restrictTo('super-admin'), accountSubHeadController.createAccountSubHead)

router
  .route('/:accountSubHeadId')
  .get(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), accountSubHeadController.checkId, accountSubHeadController.getAccountSubHead)
  .patch(authController.protect, authController.restrictTo('super-admin'), accountSubHeadController.checkId, accountSubHeadController.updateAccountSubHead)

module.exports = router;