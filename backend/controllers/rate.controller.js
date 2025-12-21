const rateService = require('../services/rate.service');

class RateController {
  async rateRecipe(req, res) {
    try {
      const { userId, recipeId, rating } = req.body;

      if (!userId|| !recipeId || rating === undefined) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      const result = await rateService.createRate({ userId, recipeId, rating });
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RateController();
