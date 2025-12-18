const express = require('express');
const router = express.Router();
const recommendedController = require('../controllers/recommendedRecipe.controller');

router.get('/:userId', recommendedController.getByUser);

module.exports = router;
