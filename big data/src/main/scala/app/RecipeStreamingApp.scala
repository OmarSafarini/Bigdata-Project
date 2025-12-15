package app

import models._
import bloomFilter._
import service._

import data.kafka.KafkaSource
import data.spark.SparkStreamingContext
import data.mongo.RecipeRepository

object RecipeStreamingApp {

  def main(args: Array[String]): Unit = {

    val ssc = SparkStreamingContext.create()
    val stream = KafkaSource.createStream(ssc)


    val recipes = RecipeRepository.loadAllRecipes()


    val ingredientBloom = new BloomFilterHelper(1000000, 0.01)
    val allIngredients = recipes.flatMap(_.ingredients).distinct
    ingredientBloom.addAll(allIngredients)

    val validationService = new IngredientValidationService(ingredientBloom)
    val recommendationService = new RecommendationService(recipes)


    stream.map(_.value).foreachRDD { rdd =>
      if (!rdd.isEmpty()) {
        val events = rdd.collect()

        events.foreach { jsonMsg =>
          try {

            val ingEvent = KafkaEventsHandler.getIngredientEvent(jsonMsg)

            println(s"\nUser: ${ingEvent.userId} | Action: ${ingEvent.action} | Ingredient: ${ingEvent.ingredient}")

            if (ingEvent.action == "ADD") {
              if (validationService.shouldRunRecommendation(ingEvent.ingredient)) {

                println("Ingredient exists in dataset ... run recommendation")

              } else {
                println("Ingredient not in dataset, skip recommendation")
              }
            }
            else {
              println("The action is REMOVE ... run recommendation")
            }

          } catch {
            case e: Exception => println(s"Parse error: ${e.getMessage}")
          }
        }
      }
    }


    ssc.start()
    ssc.awaitTermination()
  }
}
