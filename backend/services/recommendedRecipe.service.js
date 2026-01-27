const Recipes = require('../models/Recipes');
const RecommendedRecipe = require('../models/recommendedRecipe');

class RecommendedRecipeService {


   async getUserRecommendations(userId) {
    try {
      // 1. Get recommended recipes for user
      const recommendations = await this.getRecommendedRecipesBasedOnUserId(userId);

      // 2. Extract titles
      const titles = recommendations.map(r => r.title);

      const lastFiveTitles = titles.slice(0, 20);

      console.log("koko" + lastFiveTitles)

      // 3. Find matching recipes
      return await Recipes.find({
        title: { $in: lastFiveTitles }
      }).limit(20);

    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      throw error;
    }
  }

  async getRecommendedRecipesBasedOnUserId(userId) {
      try {
      return await RecommendedRecipe.find({ "userId" : userId }).sort({ _id: -1 });
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
