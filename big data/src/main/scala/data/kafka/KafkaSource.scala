package data.kafka

import config.KafkaConfig

import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.spark.streaming.StreamingContext
import org.apache.spark.streaming.dstream.InputDStream
import org.apache.spark.streaming.kafka010._
import org.apache.spark.streaming.kafka010.LocationStrategies.PreferConsistent
import org.apache.spark.streaming.kafka010.ConsumerStrategies.Subscribe


object KafkaSource {

  def createStream(ssc: StreamingContext): InputDStream[ConsumerRecord[String, String]] = {

    KafkaUtils.createDirectStream[String, String](
      ssc,
      PreferConsistent,
      Subscribe[String, String](Array(KafkaConfig.topic), KafkaConfig.params)
    )

  }
}
