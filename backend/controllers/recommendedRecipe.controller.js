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
}

module.exports = new RecommendedRecipeController();
