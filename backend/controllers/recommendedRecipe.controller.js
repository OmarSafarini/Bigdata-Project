const recommendedService = require('../services/recommendedRecipe.service');

class RecommendedRecipeController {
  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const recommendations = await recommendedService.getUserRecommendations(userId);
      res.json(recommendations);
    } catch(err) {
      res.status(500).json({ error: err.message });
    }
  }

  getRecommendationById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await recommendedRecipeService.getRecommendationById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


}

module.exports = new RecommendedRecipeController();
