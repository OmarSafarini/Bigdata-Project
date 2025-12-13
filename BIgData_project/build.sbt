ThisBuild / version := "0.1.0-SNAPSHOT"
ThisBuild / scalaVersion := "2.12.10"

lazy val root = (project in file("."))
  .settings(
    name := "BIgData_project"
  )

libraryDependencies += "org.apache.spark" %% "spark-sql" % "3.5.7"

libraryDependencies += "org.apache.spark" %% "spark-core" % "3.5.7"

libraryDependencies += "org.mongodb.spark" %% "mongo-spark-connector" % "10.5.0"

libraryDependencies += "org.apache.spark" %% "spark-mllib" % "3.5.1"
