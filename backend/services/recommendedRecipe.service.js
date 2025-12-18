const RecommendedRecipe = require('../models/recommendedRecipe');

class RecommendedRecipeService {
  async getUserRecommendations(userId) {
    return await RecommendedRecipe.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new RecommendedRecipeService();
