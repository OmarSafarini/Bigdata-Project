package data.spark

import config.SparkConfig

import org.apache.spark.streaming.{Seconds, StreamingContext}

object SparkStreamingContext {

  def create(): StreamingContext = {
    new StreamingContext(
      SparkConfig.createSparkConf(),
      Seconds(SparkConfig.streamingTimeInSec)
    )
  }
}
