import sbt._

object Dependencies {

  val zioVersion = "2.1.26"
  val zioHttpVersion = "3.10.1"

  val zioHttp     = "dev.zio" %% "zio-http"     % zioHttpVersion

  val zioTest     = "dev.zio" %% "zio-test"     % zioVersion % Test
  val zioTestSBT = "dev.zio" %% "zio-test-sbt" % zioVersion % Test
  val zioTestMagnolia = "dev.zio" %% "zio-test-magnolia" % zioVersion % Test
  val ziojson = "dev.zio" %% "zio-json" % "0.7.1"
  val osLib = "com.lihaoyi" %% "os-lib" % "0.11.3"
  val quill = "io.getquill" %% "quill-jdbc-zio" % "4.8.6"
  val postqresql = "org.postgresql" %  "postgresql" % "42.3.1"
}
