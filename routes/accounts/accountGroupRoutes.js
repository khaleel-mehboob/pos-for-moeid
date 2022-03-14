const express = require('express');
const accountController = require('../../controllers/accounts/accountController');
const authController = require('../../controllers/auth/authController');

const accountHeadRouter = require('./accountHeadRoutes');
const accountRouter = require('./accountRoutes');

const router = express.Router();

router.use('/:accountGroup/accountHeads', accountHeadRouter);
router.use('/:accountGroup/accounts', accountRouter);

module.exports = router;