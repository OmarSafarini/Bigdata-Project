const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

router.get('/', recipeController.getAll);

router.get('/:id', recipeController.getById);

module.exports = router;
