package app

import models._
import bloomFilter._
import service._
import data.kafka.KafkaStructured
import data.spark.SparkSessionManager
import data.mongo.RecipeRepository
import org.apache.spark.sql.Dataset

import service.Recommendation

object RecommendationApp
{

  def main(args: Array[String]): Unit = {


    val spark = SparkSessionManager.getOrCreateMongoSession()
    spark.sparkContext.setLogLevel("ERROR")

    import spark.implicits._
    val stream = KafkaStructured.createStream(spark)

    val recipes = RecipeRepository.loadAllRecipes(spark).limit(30000)
    val ingredientBloom = new BloomFilterHelper(1000000, 0.01)
    val allIngredients = recipes.flatMap(_.NER).distinct.collect().toSeq
    ingredientBloom.addAll(allIngredients)


    val validationService = new IngredientValidationService(ingredientBloom)

    val checkpointPath = "file:///C:/tmp/spark-checkpoint-recommendation"

    val query = stream
      .selectExpr("CAST(value AS STRING)")
      .as[String]
      .writeStream
      .option("checkpointLocation", checkpointPath)
      .foreachBatch { (batchDF: Dataset[String], batchId: Long) =>
        if (!batchDF.isEmpty) {
          val events = batchDF.collect()
          events.foreach { jsonMsg =>
            try {
              val ingEvent = EventUtilities.convertJsonToIngredient(jsonMsg)

              if (ingEvent.action == "ADD" && validationService.shouldRunRecommendation(ingEvent.ingredient))
              {
                Recommendation.recommendation(recipes, ingEvent.userId)
              }
              else if (ingEvent.action == "REMOVE")
              {
                Recommendation.recommendation(recipes, ingEvent.userId)
              }
            } catch {
              case e: Exception => println(s"Parse error: ${e.getMessage}")
            }
          }
        }
      }
      .start()

    query.awaitTermination()
  }
}
