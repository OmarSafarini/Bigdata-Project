package data.mongo

import config.MongoConfig
import models.Recipe

import org.mongodb.scala._
import org.mongodb.scala.bson.BsonArray
import scala.concurrent.Await
import scala.concurrent.duration._

object RecipeRepository {

  private val client: MongoClient =
    MongoClient(MongoConfig.uri)

  private val database: MongoDatabase =
    client.getDatabase(MongoConfig.databaseName)

  private val collection: MongoCollection[Document] =
    database.getCollection(MongoConfig.recipeCollection)

  def loadAllRecipes(): Seq[Recipe] = {
    Seq(
      Recipe("1", Seq("cheese", "tomato", "flour")),
      Recipe("2", Seq("lettuce", "tomato")),
      Recipe("3", Seq("egg", "milk")),
      Recipe("4", Seq("cheese"))
    )
  }

}
