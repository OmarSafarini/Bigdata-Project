const mongoose = require("mongoose");

const RecipesSchema = new mongoose.Schema({
  _id: String,         
  title: String,
  ingredients: [String],
  directions: [String],
  link: String,
  source: String,
  NER: [[String]] 
}, { collection: "recipes" });

module.exports = mongoose.model("Recipes", RecipesSchema);