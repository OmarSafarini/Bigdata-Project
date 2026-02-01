package app

import models._
import bloomFilter._
import service._
import data.kafka.KafkaStructured
import data.spark.SparkSessionManager
import data.mongo.RecipeRepository
import service.UserService
import org.apache.spark.sql.Dataset

object RecipeStreamingApp {

  def main(args: Array[String]): Unit = {

    val spark = SparkSessionManager.getOrCreateMongoSession()
    spark.sparkContext.setLogLevel("ERROR")


    import spark.implicits._
    val stream = KafkaStructured.createStream(spark)

    val recipes = RecipeRepository.loadAllRecipes(spark).limit(1000)
    val ingredientBloom = new BloomFilterHelper(1000000, 0.01)
    val allIngredients = recipes.flatMap(_.NER).distinct.collect().toSeq
    ingredientBloom.addAll(allIngredients)


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

              if (ingEvent.action == "ADD") {
                UserService.addIngredient(ingEvent.userId, ingEvent.ingredient)
              } else {
                UserService.removeIngredient(ingEvent.userId, ingEvent.ingredient)
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
