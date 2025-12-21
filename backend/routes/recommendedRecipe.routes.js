const express = require('express');
const router = express.Router();
const recommendedController = require('../controllers/recommendedRecipe.controller');

router.get('/user/:userId', recommendedController.getByUser);

router.get('/:recipeId', recommendedController.getRecommendationById);



module.exports = router;
