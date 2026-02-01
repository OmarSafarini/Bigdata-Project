package service

import config.SparkConfig
import data.mongo.{RatingUserRecipes, RecipeRepository, RecommendationRepository, UserDataAccess}
import data.spark.SparkSessionManager
import models.Recipe
import org.apache.spark.ml.feature.CountVectorizer
import org.apache.spark.ml.linalg.Vector
import org.apache.spark.sql.functions._
import org.apache.spark.sql.{Dataset, Row}

import service.StringToHashCodeInt.stringToPositiveIntId

object Recommendation {

  def recommendation(recipesDS: Dataset[Recipe], userIds: String): Unit = {
    val spark = SparkSessionManager.getOrCreateMongoSession()
    spark.sparkContext.setLogLevel("ERROR")
    import spark.implicits._

    // ===== User info =====
    val userInfo = UserDataAccess.findUserById(userIds)
    val userIntId = stringToPositiveIntId(userIds)
    val clientIngredients = Seq((userIntId, userInfo.ingredients.toArray))

    // ===== User ratings =====
    val userRatings = RatingUserRecipes.getAllRatings(userIds).map { r =>
      val recipeIntId = stringToPositiveIntId(r.recipeId)
      (userIntId, recipeIntId, r.rating)
    }

    // ===== Recipes dataset =====
    val recipes = recipesDS.collect().map { r =>
      val recipeIntId = stringToPositiveIntId(r.id)
      (recipeIntId, r.title, r.directions, r.ingredients, r.NER.toArray)
    }

    val clientIngredientsDF = clientIngredients.toSeq.toDF("userId", "ingredients")
    val recipesDF = recipes.toSeq.toDF("recipeId", "title", "directions", "NER", "ingredients")
    val ratingsDF = userRatings.toSeq.toDF("userId", "recipeId", "rating")

    // ===== Content-Based Filtering =====
    val cvModel = new CountVectorizer()
      .setInputCol("ingredients")
      .setOutputCol("features")
      .fit(recipesDF)

    val clientVec = cvModel.transform(clientIngredientsDF)
    val userVector = clientVec.select("features").head().getAs[Vector]("features")

    def cosineSimilarity(v1: Vector, v2: Vector): Double = {
      val dot = v1.toArray.zip(v2.toArray).map { case (a, b) => a * b }.sum
      val norm1 = math.sqrt(v1.toArray.map(x => x * x).sum)
      val norm2 = math.sqrt(v2.toArray.map(x => x * x).sum)
      if (norm1 == 0 || norm2 == 0) 0.0 else dot / (norm1 * norm2)
    }

    // ===== Ingredients overlap filter =====
    val userIngredientsLit = typedLit(userInfo.ingredients)
    val recipesWithOverlap = recipesDF.withColumn(
      "overlapCount",
      size(array_intersect(col("ingredients"), userIngredientsLit))
    )

    // فقط الوصفات اللي عندها أي ingredient مشترك
    val filteredRecipes = recipesWithOverlap.filter(col("overlapCount") > 0)

    // ===== Compute cosine similarity =====
    val filteredRecipesVec = cvModel.transform(filteredRecipes)
    val contentScores = filteredRecipesVec.map { row =>
      val id = row.getAs[Int]("recipeId")
      val vec = row.getAs[Vector]("features")
      val score = cosineSimilarity(userVector, vec)
      (id, score)
    }.toDF("recipeId", "score")

    // ===== Merge scores with recipes =====
    val recommendedRecipes = filteredRecipes
      .join(contentScores, "recipeId")
      .orderBy(desc("overlapCount"), desc("score")) // الأكثر ظهور أولًا، بعده cosine similarity
      .select(
        lit(userIntId).as("userId"),
        col("title"),
        col("directions"),
        col("ingredients").as("NER"),
        col("NER").as("ingredients"),
        col("score").as("predictedRating")
      )

    // ===== Insert into DB =====
    recommendedRecipes.limit(20).collect().foreach { row =>
      val ingredients: String = row.getAs[Seq[String]]("NER").mkString(", ")
      val rating: String = row.getAs[Double]("predictedRating").toString
      val title: String = row.getAs[String]("title")
      val directions: String = row.getAs[String]("directions")
      val NER: String = row.getAs[String]("ingredients")
      RecommendationRepository.addRecommendation(userIds, ingredients, directions, title, rating, NER)
    }

    println(s"=== Recommended Recipes for user $userIntId ===")
    recommendedRecipes.show(false)
  }

}
