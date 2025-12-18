package config

import org.apache.spark.SparkConf

object SparkConfig {
  val sparkAppName = "RecipeStructuredStreamingApp"
  val sparkMaster = "local[*]"
}
