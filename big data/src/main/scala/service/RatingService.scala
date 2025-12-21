package service

import data.mongo.RatingUserRecipes

object RatingService {

  def addRating(userId: String, recipeId: String, rating: Int): Unit = {
    RatingUserRecipes.addRatingUser(userId, recipeId, rating);
  }

}
