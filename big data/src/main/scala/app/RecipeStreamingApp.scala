package app

import models._
import bloomFilter._
import config.{KafkaConfig, SparkConfig}
import service._
import data.kafka.KafkaStructured
import data.spark.SparkSessionManager
import data.mongo.RecipeRepository
import service.UserService
import org.apache.spark.sql.Dataset

object RecipeStreamingApp {

  def main(args: Array[String]): Unit = {

    val spark = SparkSessionManager.getOrCreateMongoSession(SparkConfig.sparkAppName) // i changed the SparkMangeger
    spark.sparkContext.setLogLevel("ERROR")
//    System.setProperty("hadoop.home.dir", "C:\\")
//    spark.conf.set("spark.hadoop.io.native.lib.available", "false")


    import spark.implicits._
      val stream = KafkaStructured.createStream(spark)

    val recipes = RecipeRepository.loadAllRecipes(spark).limit(1000)
    val ingredientBloom = new BloomFilterHelper(1000000, 0.01)
    val allIngredients = recipes.flatMap(_.NER).distinct.collect().toSeq
    ingredientBloom.addAll(allIngredients)
    println("Number of Ing: " , allIngredients.size)


    val validationService = new IngredientValidationService(ingredientBloom)

    val checkpointPath = "file:///C:/tmp/spark-checkpoint-ingredient"

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

//              println(s"\nUser: ${ingEvent.userId} | Action: ${ingEvent.action} | Ingredient: ${ingEvent.ingredient}")

              if (ingEvent.action == "ADD") {
                if (validationService.shouldRunRecommendation(ingEvent.ingredient)) {
                  Recommendation.recommendation(recipesDS =recipes, ingEvent.userId)
                } else {
                  println("Ingredient not in dataset, skip recommendation")
                }
                UserService.addIngredient(ingEvent.userId, ingEvent.ingredient)
              } else {
                Recommendation.recommendation(recipesDS =recipes, ingEvent.userId )
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
