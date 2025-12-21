const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  directions: String,
  link: String,
  source: String,
  NER: [String]
}, { collection: "recipes" });

module.exports = mongoose.model("Recipe", RecipeSchema);