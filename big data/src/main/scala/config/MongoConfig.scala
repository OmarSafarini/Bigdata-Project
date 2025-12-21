package config

object MongoConfig {

  val uri = "mongodb://localhost:27017"
  val databaseName = "recipes"
  val recipeCollectionName = "recipes"
  val usersCollectionName = "users"
  val ratingCollectionName = "rate"
  val recommendedCollectionName = "recommended_recipes"
}
