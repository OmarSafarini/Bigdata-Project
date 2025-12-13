
import org.apache.log4j.{BasicConfigurator, Level, Logger}
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.ml.feature.CountVectorizer
import org.apache.spark.ml.linalg.Vector
import org.apache.spark.ml.recommendation.ALS

object RecipeRecommendation {

  def main(args: Array[String]): Unit = {

    // Disable Spark logs
    Logger.getLogger("org").setLevel(Level.ERROR)
    BasicConfigurator.configure()

    val spark = SparkSession.builder()
      .appName("HybridRecipeRecommendation")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    /////////////////////////////////////////////////////////////
    // 1) SIMPLE DATA
    /////////////////////////////////////////////////////////////

    val clientIngredients = Seq(
      (0, Array("Eggs", "Cheese", "Tomato"))
    )

    val userRatings = Seq(
      (0, 0, 5),
      (0, 1, 4),
      (0, 2, 3),
      (0, 3, 4)
    )

    val recipes = Seq(
      (0, "recipe1", Array("Eggs", "Cheese", "Bread")),
      (1, "recipe2", Array("Chicken", "Rice", "Pepper")),
      (2, "recipe3", Array("Spinach", "Eggs", "Onion")),
      (3, "recipe4", Array("Cheese", "Lettuce", "Bread"))
    )

    val clientIngredientsDF = clientIngredients.toDF("userId", "ingredients")
    val recipesDF = recipes.toDF("recipeId", "title", "ingredients")
    val ratingsDF = userRatings.toDF("userId", "recipeId", "rating")


    /////////////////////////////////////////////////////////////
    // 2) CONTENT-BASED FILTERING (ingredients similarity)
    /////////////////////////////////////////////////////////////

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
      val title = row.getAs[String]("title")
      val vec = row.getAs[Vector]("features")
      val score = cosineSimilarity(userVector, vec)
      (id, title, score)
    }.toDF("recipeId", "title", "contentScore")


    /////////////////////////////////////////////////////////////
    // 3) ALS COLLABORATIVE FILTERING
    /////////////////////////////////////////////////////////////

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

    // userId , recipeId , prediction


    /////////////////////////////////////////////////////////////
    // 4) HYBRID = content(0.6) + ALS(0.4)
    /////////////////////////////////////////////////////////////

    val hybrid = contentScores
      .join(alsPredictions, "recipeId")
      .withColumn("finalScore", col("contentScore") * 0.6 + col("alsScore") * 0.4)
      .orderBy(desc("finalScore"))


    val recipesDF2 = recipesDF.withColumnRenamed("title", "recipeTitle")

    val recommendedRecipes = hybrid
      .join(recipesDF2, "recipeId")
      .select(
        col("recipeId"),
        col("recipeTitle").as("title"),
        col("ingredients"),
        col("finalScore")
      )


    val finalList: Seq[(Int, String, Array[String], Double)] =
      recommendedRecipes.collect().map { row =>
        (
          row.getAs[Int]("recipeId"),
          row.getAs[String]("title"),
          row.getAs[Seq[String]]("ingredients").toArray,
          row.getAs[Double]("finalScore")
        )
      }.toSeq

    /////////////////////////////////////////////////////////////
    // 5) OUTPUT
    /////////////////////////////////////////////////////////////

    println("\n=== CONTENT-BASED SCORES ===")
    contentScores.orderBy(desc("contentScore")).show(false)

    println("\n=== ALS SCORES ===")
    alsPredictions.orderBy(desc("alsScore")).show(false)

    println("\n=== FINAL HYBRID RECOMMENDATION ===")
    hybrid.show(false)

    finalList.foreach { case (id, title, ingredients, score) =>
      println(s"$id, $title, ${ingredients.mkString("[", ", ", "]")}, $score")
    }


    spark.stop()
  }
}

