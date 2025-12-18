package service

import data.mongo.UserDataAccess

object UserService {

  def addIngredient(userId: String, ingredient: String): Unit = {
    UserDataAccess.addIngredientToUser(userId, ingredient)
  }

}