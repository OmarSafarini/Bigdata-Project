const Recipes = require("../models/Recipes");
const Recipe = require("../models/Recipe");

class RecipeService {
    async getAllRecipes(page=1,limit=10) {
        const steps = (page -1 ) * limit;
        return await Recipes.find().skip(steps).limit(limit);
    }
    async getRecipeById(id) {
        return await Recipe.findById(id);
    }
}

module.exports = new RecipeService();