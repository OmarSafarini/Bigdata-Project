package data.kafka

import config.KafkaConfig
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.DataFrame

object KafkaStructured {

  def createStream(spark: SparkSession): DataFrame = {
    spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", KafkaConfig.bootstrapServers)
      .option("subscribe", KafkaConfig.topics.mkString(","))
      .option("startingOffsets", "latest")
      .load()
  }

  def createRatingStream(spark: SparkSession): DataFrame = {
    spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", KafkaConfig.bootstrapServers)
      .option("subscribe", KafkaConfig.ratingTopics.mkString(","))
      .option("startingOffsets", "latest")
      .load()
  }


}
