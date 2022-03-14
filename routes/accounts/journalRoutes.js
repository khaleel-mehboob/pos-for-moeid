const express = require('express');
const journalController = require('../../controllers/accounts/journalController');
const authController = require('../../controllers/auth/authController');

const ledgerRouter = require('./ledgerRoutes');

const router = express.Router();
router.use('/:id/ledger', ledgerRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('super-admin'), journalController.getJournal)
  .post(authController.protect, authController.restrictTo('super-admin', 'admin', 'cash-counter'), journalController.createJournalEntry)

router
  .route('/:id')
  .get(authController.protect, authController.restrictTo('super-admin'), journalController.checkId, journalController.getJournalEntry)
  
module.exports = router;