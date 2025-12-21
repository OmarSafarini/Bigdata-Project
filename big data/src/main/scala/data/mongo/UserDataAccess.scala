package data.mongo

import config.MongoConfig
import models.{Recipe, UserInfo}
import org.mongodb.scala._
import org.mongodb.scala.model.Filters._
import org.mongodb.scala.model.Updates._
import org.bson.types.ObjectId
import scala.concurrent.Await
import scala.concurrent.duration._
import scala.jdk.CollectionConverters.asScalaBufferConverter


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


  def removeIngredientFromUser(userId: String, ingredient: String): Unit = {
    try {
      val filter = equal("_id", new ObjectId(userId))
      val update = pull("ingredients", ingredient.toLowerCase.trim)

      val result = Await.result(
        usersCollection.updateOne(filter, update).toFuture(),
        5.seconds
      )

      if (result.getModifiedCount > 0) {
        println(s"Removed '$ingredient' from user $userId")
      } else {
        println(s"User $userId not found or ingredient does not exist")
      }

    } catch {
      case e: Exception =>
        println(s"Error removing ingredient: ${e.getMessage}")
    }
  }





  def findUserById(userId: String): UserInfo = {
    try {
      val filter = equal("_id", new ObjectId(userId))
      val futureUser = usersCollection.find(filter).first().toFuture()
      val doc = Await.result(futureUser, 5.seconds)

      if (doc != null) {
        UserInfo(
          id = doc.getObjectId("_id").toHexString,
          ingredients = doc.getList("ingredients", classOf[String]).asScala.toSeq
        )
      } else {
        UserInfo(id = userId, ingredients = Seq.empty)
      }
    } catch {
      case e: Exception =>
        println(s"Error finding user $userId: ${e.getMessage}")
        UserInfo(id = userId, ingredients = Seq.empty)
    }
  }
}