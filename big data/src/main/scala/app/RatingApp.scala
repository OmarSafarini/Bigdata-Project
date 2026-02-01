package app

import models._
import config.{KafkaConfig, SparkConfig}
import service._
import data.kafka.KafkaStructured
import data.spark.SparkSessionManager
import data.mongo.RecipeRepository
import org.apache.spark.sql.Dataset

object RatingApp {

  def main(args: Array[String]): Unit = {

    // إنشاء Spark Session مع MongoDB
    val spark = SparkSessionManager.getOrCreateMongoSession()
    spark.sparkContext.setLogLevel("ERROR")
    import spark.implicits._

    val stream = KafkaStructured.createRatingStream(spark)

    val recipes = RecipeRepository.loadAllRecipes(spark).limit(1000)

    val checkpointPath = "file:///C:/tmp/spark-checkpointt-rating"

    val query = stream
      .selectExpr("CAST(value AS STRING)")
      .as[String]
      .writeStream
      .option("checkpointLocation", checkpointPath)
      .foreachBatch { (batchDF: Dataset[String], batchId: Long) =>
        if (!batchDF.isEmpty) {
          batchDF.collect().foreach { jsonMsg =>
            try {
              val ingEvent = EventUtilities.convertJsonToRating(jsonMsg)
              val userRating = UserRating(ingEvent.userId, ingEvent.recipeId, ingEvent.rating)

              println(s"User: ${userRating.userId} | Recipe: ${userRating.recipeId} | Rating: ${userRating.rating}")

              RatingService.addRating(userRating.userId, userRating.recipeId, userRating.rating)

              Recommendation.recommendation(recipes,userRating.userId)
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
