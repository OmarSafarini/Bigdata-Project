package service

import models.{IngredientEvent, UserRating}
import play.api.libs.json._


object EventUtilities {

  def convertJsonToIngredient(jsonMsg: String): IngredientEvent = {
    val json = Json.parse(jsonMsg)

    IngredientEvent(
      userId = (json \ "userId").as[String],
      ingredient = (json \ "ingredient").as[String],
      action = (json \ "action").as[String]
    )
  }

    def convertJsonToRating(jsonMsg: String): UserRating = {
      val json = Json.parse(jsonMsg)

      UserRating(
        userId = (json \ "userId").as[String],
        recipeId = (json \ "recipeId").as[String],
        rating = (json \ "rating").as[Int]
      )
    }
}