const RecommendedRecipe = require('../models/recommendedRecipe');

class RecommendedRecipeService {


  async getUserRecommendations(userId) {
    try {
      return await RecommendedRecipe.find({ "userId" : userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }


  async getRecommendationById(recipeId) {
    return await RecommendedRecipe.findById(recipeId).lean();
  }


}

module.exports = new RecommendedRecipeService();
