package data.spark

import config.{MongoConfig, SparkConfig}
import org.apache.spark.sql.SparkSession

object SparkSessionManager {

  def getOrCreateMongoSession(spark_config: String ): SparkSession = {
    SparkSession.builder()
      .appName(spark_config)
      .master(SparkConfig.sparkMaster)
      .config("spark.mongodb.read.connection.uri", MongoConfig.uri)
      .config("spark.mongodb.write.connection.uri", MongoConfig.uri)
      .getOrCreate()
  }


}


