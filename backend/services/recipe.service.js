const Recipes = require("../models/Recipes");
const Recipe = require("../models/Recipe");

class RecipeService {
    async getAllRecipes(page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        return await Recipes.find().skip(skip).limit(limit);
    }

    async getRecipeById(id) {
        return await Recipe.findById(id);
    }

    async getAllSearchedRecipes(search = "", page = 1, limit = 30) {
        const skip = (page-1) * limit;

        const searchArray = search.split(',').map(s => s.trim()).filter(s => s);

        const recipes = await Recipes.find({
            $and: searchArray.map(item => ({
                NER: { $regex: item, $options: "i" }
            })) 
        })
        .skip(skip)
        .limit(limit);

        return recipes;
    }
}

module.exports = new RecipeService();
