package config

import org.apache.spark.SparkConf

object SparkConfig {

  val streamingTimeInSec = 5;

  def createSparkConf(): SparkConf =
    new SparkConf()
      .setAppName("RecipeStreamingApp")
      .setMaster("local[4]")
}
