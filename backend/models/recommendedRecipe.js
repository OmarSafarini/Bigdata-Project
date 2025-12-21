const mongoose = require('mongoose');

const RecommendedRecipeSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true 
      },

    NER:{
      type: String,
      required: true
    },
  title: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    required: true
  },
  ingredients: {
    type: String, 
    required: true
  },
  rating: {
    type: Number,
    default: 0
  }
}, { collection: 'recommended_recipes', timestamps: true });

module.exports = mongoose.model('RecommendedRecipe', RecommendedRecipeSchema);
