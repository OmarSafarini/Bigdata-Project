const mongoose = require('mongoose');

const RecommendedRecipeSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  recipe: {
    title: String,
    ingredients: [String],
    directions: [String],
    link: String,
    source: String,
    NER: [String]
  }
}, { collection: 'recommended_recipes', timestamps: true });

module.exports = mongoose.model('RecommendedRecipe', RecommendedRecipeSchema);
