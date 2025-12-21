package config

import org.apache.spark.SparkConf

object SparkConfig {
  val sparkAppName = "RecipeStructuredStreamingApp"
  val sparkRatingAppName = "RatingApp"
  val sparkMaster = "local[*]"
}
