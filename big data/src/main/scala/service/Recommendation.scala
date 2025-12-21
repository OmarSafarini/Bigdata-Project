package service

import config.SparkConfig
import data.mongo.{RatingUserRecipes, RecipeRepository, RecommendationRepository, UserDataAccess}
import data.spark.SparkSessionManager
import models.Recipe
import org.apache.spark.ml.feature.CountVectorizer
import org.apache.spark.ml.recommendation.ALS
import org.apache.spark.ml.linalg.Vector
import org.apache.spark.sql.functions._
import org.apache.spark.sql.{DataFrame, Dataset}
import service.StringToHashCodeInt.stringToPositiveIntId

object Recommendation {

  def recommendation (recipesDS : Dataset[Recipe] , userIds : String): Unit = {
    val spark = SparkSessionManager.getOrCreateMongoSession(SparkConfig.sparkRatingAppName)
    spark.sparkContext.setLogLevel("ERROR")
    import spark.implicits._


    val userInfo = UserDataAccess.findUserById(userIds)
    val userIntId = stringToPositiveIntId(userIds)

    val clientIngredients = Seq(
      (userIntId, userInfo.ingredients.toArray)
    ) // (34225,"egg,hummus")


    val userRatings = {
      val ratings = RatingUserRecipes.getAllRatings(userIds)
      ratings.map { r =>
        val recipeIntId = stringToPositiveIntId(r.recipeId)
        (userIntId, recipeIntId, r.rating)
      }
    }

    val recipes = recipesDS.collect().map { r =>
      val recipeIntId = stringToPositiveIntId(r.id)
        (recipeIntId,r.title,r.directions,r.ingredients,r.NER.toArray)
    }

    val clientIngredientsDF = clientIngredients.toSeq.toDF("userId", "ingredients")
    val recipesDF = recipes.toSeq.toDF("recipeId","title","directions","NER","ingredients")
    val ratingsDF = userRatings.toSeq.toDF("userId", "recipeId", "rating")

    // ===== Content-Based Filtering =====

    val cvModel = new CountVectorizer()
      .setInputCol("ingredients")
      .setOutputCol("features")
      .fit(recipesDF)

    val recipesVec = cvModel.transform(recipesDF)
    val clientVec = cvModel.transform(clientIngredientsDF)
    val userVector = clientVec.select("features").head().getAs[Vector]("features")

    def cosineSimilarity(v1: Vector, v2: Vector): Double = {
      val dot = v1.toArray.zip(v2.toArray).map { case (a, b) => a * b }.sum
      val norm1 = math.sqrt(v1.toArray.map(x => x * x).sum)
      val norm2 = math.sqrt(v2.toArray.map(x => x * x).sum)
      if (norm1 == 0 || norm2 == 0) 0.0 else dot / (norm1 * norm2)
    }

    val contentScores = recipesVec.map { row =>
      val id = row.getAs[Int]("recipeId")
      val vec = row.getAs[Vector]("features")
      val score = cosineSimilarity(userVector, vec)
      (id, score)
    }.toDF("recipeId", "contentScore")

          // ===== ALS Collaborative Filtering =====
          val als = new ALS()
            .setUserCol("userId")
            .setItemCol("recipeId")
            .setRatingCol("rating")
            .setColdStartStrategy("drop")

          val alsModel = als.fit(ratingsDF)
          val userId = clientIngredientsDF.select("userId").head().getAs[Int]("userId")
          val userRecipes = recipesDF.select("recipeId").withColumn("userId", lit(userId))

          val alsPredictions = alsModel.transform(userRecipes)
            .select("recipeId", "prediction")
            .withColumnRenamed("prediction", "alsScore")


          val hybrid = contentScores
            .join(alsPredictions, "recipeId")
            .withColumn("finalScore", col("contentScore") * 0.6 + col("alsScore") * 0.4)
            .orderBy(desc("finalScore"))


          val recommendedRecipes = hybrid
            .join(recipesDF, "recipeId")
            .select(
              lit(userId).as("userId"),
              col("title").as("title"),
              col("directions").as("directions"),
              col("ingredients").as("NER"),
              col("NER").as("ingredients"),
              col("alsScore").as("predictedRating")
            )
            .orderBy(asc("predictedRating"))

    recommendedRecipes.collect().foreach { row =>
      val ingredients: String = row.getAs[Seq[String]]("NER").mkString(", ")
      val rating: String = row.getAs[Double]("predictedRating").toString
      val title: String = row.getAs[String]("title")
      val directions: String = row.getAs[String]("directions")
      val NER: String = row.getAs[String]("ingredients")
      RecommendationRepository.addRecommendation(userIds,ingredients,directions,title,rating,NER)
    }

          println("=== Recommended Recipes for user " + userId + " ===")
          recommendedRecipes.show(false)

        }

}
