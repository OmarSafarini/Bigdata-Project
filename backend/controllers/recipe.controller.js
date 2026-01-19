const recipeService = require("../services/recipe.service");

class RecipeController {
    async getAll(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const ingredient = req.query.ingredient || "";

            let recipes;
            if (ingredient) {
                recipes = await recipeService.getAllSearchedRecipes(ingredient, page, limit);
            } else {
                recipes = await recipeService.getAllRecipes(page, limit);
            }

            res.json(recipes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const id = req.params.id;
            const recipe = await recipeService.getRecipeById(id);
            if (!recipe) return res.status(404).json({ message: 'Recipe not found ' + recipe });
            res.json(recipe);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getRecipeByTitle (req, res) {
        try {
            const title = req.params.title;
            const recipe = await Recipe.findOne({ title: title });
            if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
            res.json(recipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new RecipeController();
