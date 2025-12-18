const mongoose = require('mongoose');
const Rate = require('../models/rate');

class RateService {
  async createRate(data) {
    if (typeof data.recipeId === 'string') {
      data.recipeId = new mongoose.Types.ObjectId(data.recipeId);
    }

    const rate = new Rate(data);
    return await rate.save();
  }
}

module.exports = new RateService();
