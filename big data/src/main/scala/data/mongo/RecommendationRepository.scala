package data.mongo
import config.MongoConfig
import data.mongo.UserDataAccess.usersCollection
import models.Recipe
import org.apache.spark.sql.{DataFrame, Dataset, SparkSession}
import org.apache.spark.sql.functions._
import org.mongodb.scala._
import scala.concurrent.duration._
import scala.concurrent.Await

object RecommendationRepository {
  private val client: MongoClient = MongoClient(MongoConfig.uri)
  private val database: MongoDatabase = client.getDatabase(MongoConfig.databaseName)
  private val recommendedCollection: MongoCollection[Document] = database.getCollection(MongoConfig.recommendedCollectionName)

  def addRecommendation(NER: String,direction : String,title : String,rating: String , ingredients : String): Unit = {
    val doc = Document(
      "NER" -> NER,
      "title" -> title,
      "direction" -> direction,
      "ingredients" -> ingredients,
      "rating" -> rating
    )
    Await.result(recommendedCollection.insertOne(doc).toFuture(), 10.seconds)
  }
}
