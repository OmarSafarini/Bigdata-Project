package config

import org.apache.kafka.common.serialization.StringDeserializer

object KafkaConfig {
  val bootstrapServers = "localhost:9092"
  val topics = Array("testing-kafka1")
  val ratingTopics = Array("user-ratings-events")
}