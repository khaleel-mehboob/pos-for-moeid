const express = require('express');
const saController = require('../../controllers/roles/saController');

const router = express.Router();

router
  .route('/defaultSetup')
  .get(saController.setup)

router
  .route('/defaultCategories')
  .get(saController.setupCategories)

router
  .route('/defaultItems')
  .get(saController.setupItems)

module.exports = router;