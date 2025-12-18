const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rate.controller');

router.post('/', rateController.rateRecipe);

module.exports = router;
