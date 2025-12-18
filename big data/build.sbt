ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "2.12.18"

lazy val sparkVersion = "3.5.7"
lazy val kafkaVersion = "3.5.1"


lazy val root = (project in file("."))
  .settings(
    name := "Temp1",
    libraryDependencies ++= Seq(
      "org.apache.spark" %% "spark-core" % sparkVersion,
      "org.apache.spark" %% "spark-sql" % sparkVersion,
      "org.apache.spark" %% "spark-streaming" % sparkVersion,
      "org.apache.spark" %% "spark-sql-kafka-0-10" % sparkVersion,
      "org.apache.spark" %% "spark-streaming-kafka-0-10" % sparkVersion,
      "org.apache.kafka" % "kafka-clients" % kafkaVersion,
      "com.google.guava" % "guava" % "33.5.0-jre",
      "com.typesafe.play" %% "play-json" % "2.10.8",
      "org.mongodb.spark" %% "mongo-spark-connector" % "10.5.0" exclude("org.mongodb", "mongo-java-driver"),
      "org.mongodb" % "mongodb-driver-sync" % "5.6.2",
      "org.mongodb.scala" %% "mongo-scala-driver" % "5.6.2"
    )
  )

