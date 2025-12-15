package service

import models.IngredientEvent

import play.api.libs.json._


object KafkaEventsHandler {

  def getIngredientEvent(jsonMsg: String): IngredientEvent = {
    val json = Json.parse(jsonMsg)

    IngredientEvent(
      userId = (json \ "userId").as[String],
      ingredient = (json \ "ingredient").as[String],
      action = (json \ "action").as[String]
    )

  }
}