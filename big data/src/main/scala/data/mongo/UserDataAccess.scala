package data.mongo

import config.MongoConfig
import org.mongodb.scala._
import org.mongodb.scala.model.Filters._
import org.mongodb.scala.model.Updates._
import org.bson.types.ObjectId
import scala.concurrent.Await
import scala.concurrent.duration._


object UserDataAccess {
  private val client: MongoClient = MongoClient(MongoConfig.uri)
  private val database: MongoDatabase = client.getDatabase(MongoConfig.databaseName)
  private val usersCollection: MongoCollection[Document] = database.getCollection(MongoConfig.usersCollectionName)

  def addIngredientToUser(userId: String, ingredient: String): Unit = {
    try {
      val filter = equal("_id", new ObjectId(userId))
      val update = addToSet("ingredients", ingredient.toLowerCase.trim)

      val result = Await.result(
        usersCollection.updateOne(filter, update).toFuture(),
        5.seconds
      )

      if (result.getModifiedCount > 0) {
        println(s"Added '$ingredient' to user $userId")
      } else {
        println(s"User $userId not found or ingredient already exists")
      }
    } catch {
      case e: Exception => println(s"Error adding ingredient: ${e.getMessage}")
    }
  }

}
