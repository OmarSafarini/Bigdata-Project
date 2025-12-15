package config

import org.apache.kafka.common.serialization.StringDeserializer

object KafkaConfig {

  val bootstrapServers = "localhost:9092"
  val groupId = "ingredient-stream-group"
  val topic = "testing-kafka1"

  val params: Map[String, Object] = Map(
    "bootstrap.servers" -> bootstrapServers,
    "key.deserializer" -> classOf[StringDeserializer],
    "value.deserializer" -> classOf[StringDeserializer],
    "group.id" -> groupId,
    "auto.offset.reset" -> "latest",
    "enable.auto.commit" -> (false: java.lang.Boolean)
  )
}
