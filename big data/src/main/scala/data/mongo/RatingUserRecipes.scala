package data.mongo

import config.MongoConfig
import models.UserRating
import org.mongodb.scala._
import org.mongodb.scala.model.Filters._
import org.mongodb.scala.model.Updates._
import org.bson.types.ObjectId

import scala.concurrent.Await
import scala.concurrent.duration._

object RatingUserRecipes {
  private val client: MongoClient = MongoClient(MongoConfig.uri)
  private val database: MongoDatabase = client.getDatabase(MongoConfig.databaseName)
  private val ratingsCollection: MongoCollection[Document] = database.getCollection(MongoConfig.ratingCollectionName)

  def addRatingUser(userId: String, recipeId: String, rating: Int): Unit = {
    try {
      val recipeObjectId = new ObjectId(recipeId)

      val doc = Document(
        "userId" -> userId,
        "recipeId" -> recipeObjectId,
        "rating" -> rating
      )

      val result = Await.result(
        ratingsCollection.insertOne(doc).toFuture(), 5.seconds)

//      println(s"Inserted rating: user $userId, recipe $recipeId, rating $rating")
    } catch {
      case e: Exception =>
        println(s"Error inserting rating: ${e.getMessage}")
    }
  }

  def getAllRatings(userId: String): Seq[UserRating] = {
    try {
      val documents: Seq[Document] = Await.result(
        ratingsCollection.find(equal("userId", userId)).toFuture(),
        5.seconds
      )

      val ratings: Seq[UserRating] = documents.map { doc =>
        UserRating(
          userId = doc.getString("userId"),
          recipeId = doc.getObjectId("recipeId").toHexString,
          rating = doc.getInteger("rating")
        )
      }

//      println(s"Found ${ratings.size} ratings for user $userId")
//      println("Raw docs: " + documents)

      ratings

    } catch {
      case e: Exception =>
        println(s"Error fetching ratings: ${e.getMessage}")
        Seq.empty[UserRating]
    }
  }

}
