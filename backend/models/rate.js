// models/rate.model.js
const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
  },
  {
    collection: 'rate',
    timestamps: true
  }
);

module.exports = mongoose.model('Rate', rateSchema);
