package data.mongo

import config.MongoConfig
import models.Recipe
import org.apache.spark.sql.{DataFrame, Dataset, SparkSession}
import org.apache.spark.sql.functions._
import org.mongodb.scala._


object RecipeRepository {

  private val client: MongoClient = MongoClient(MongoConfig.uri)
  private val database: MongoDatabase = client.getDatabase(MongoConfig.databaseName)
  private val usersCollection: MongoCollection[Document] = database.getCollection(MongoConfig.usersCollectionName)

  private def getDataFrame(spark: SparkSession): DataFrame = {
    spark.read
      .format("mongodb")
      .option("database", MongoConfig.databaseName)
      .option("collection", MongoConfig.recipeCollectionName)
      .load()
  }

  def loadAllRecipes(spark: SparkSession): Dataset[Recipe] = {
    val df = getDataFrame(spark)
    import spark.implicits._

    val cleanedDF = df.drop(df.columns.filter(_.isEmpty): _*)

    val recipesDS: Dataset[Recipe] = cleanedDF.select(
      col("_id").as("id"),
      coalesce(col("NER"), array()).as("ingredients")
    ).as[Recipe]

    recipesDS
  }


}
