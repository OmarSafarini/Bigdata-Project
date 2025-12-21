const mongoose = require('mongoose');
const KafkaHelper = require('../kafka/kafkaHelper')
class RateService {

  constructor() {
    this.kafkaHelper = new KafkaHelper();
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await this.kafkaHelper.connect();
        this.initialized = true;
        console.log('Rate Service initialized');
      }
  }


  async createRate(data) {
    if (typeof data.recipeId === 'string') {
      data.recipeId = new mongoose.Types.ObjectId(data.recipeId);
    }

    if (typeof data.userId === 'string') {
      data.recipeId = new mongoose.Types.ObjectId(data.recipeId);
    }

    await this.initialize();
    await this.kafkaHelper.sendRatingEvent(data.userId,data.recipeId,data.rating);

    // const rate = new Rate(data);
    // return await rate.save();
  }
}

module.exports = new RateService();
