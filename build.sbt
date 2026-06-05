import Dependencies._

ThisBuild / organization := "castlegame"
ThisBuild / version := "0.0.1"
ThisBuild / scalaVersion      := "3.8.2"
ThisBuild / fork              := true
ThisBuild / scalacOptions     := optionsOnOrElse("2.13", "2.12")("-Ywarn-unused")("").value
ThisBuild / semanticdbEnabled := true
ThisBuild / semanticdbVersion := scalafixSemanticdb.revision
ThisBuild / scalafixDependencies ++= List("com.github.liancheng" %% "organize-imports" % "0.6.0")

def settingsApp = Seq(
  name := "server",
  Compile / run / mainClass := Option("server.MainApp"),
  Compile / unmanagedResourceDirectories += baseDirectory.value / "src" / "main" / "resources",
  testFrameworks += new TestFramework("zio.test.sbt.ZTestFramework"),
  libraryDependencies ++= Seq(
    zioHttp,
    zioTest,
    zioTestSBT,
    zioTestMagnolia,
    osLib
  ),
)

def settingsDocker = Seq(
  Docker / version          := version.value,
  dockerBaseImage := "eclipse-temurin:20.0.1_9-jre",
)

lazy val root = (project in file("."))
  .enablePlugins(JavaAppPackaging)
  .settings(settingsApp)
  .settings(settingsDocker)

lazy val os = project.in(file("."))
  .settings(
    scalaVersion := "3.8.2",
    libraryDependencies += "org.scala-lang" %% "toolkit" % "0.7.0"
  )

addCommandAlias("fmt", "scalafmt; Test / scalafmt; sFix;")
addCommandAlias("fmtCheck", "scalafmtCheck; Test / scalafmtCheck; sFixCheck")
addCommandAlias("sFix", "scalafix OrganizeImports; Test / scalafix OrganizeImports")
addCommandAlias("sFixCheck", "scalafix --check OrganizeImports; Test / scalafix --check OrganizeImports")
