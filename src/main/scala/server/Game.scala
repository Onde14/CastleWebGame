package server
import server.*
import zio._
import server.MainApp.validateEnv
import zio.stream._



class Game(gameState: GameState):
  var gameRunning = false;
  var runs = 0
  def runGame() =
      println("START GAME!")
      ZIO.scoped{
        for {
          hub <- ZIO.service[Hub[String]]
          updates <- ZIO.succeed(gameState.update())
          _ <- if updates.nonEmpty then hub.publish(outgoingMessageHandling("update",updates)) else ZIO.unit
         // _ <- ZIO.succeed(gameState.changes.clear())
          //_ <- ZIO.debug(gameState.availablePlayerSlots)
          _ <- ZIO.sleep(16.millis)
        } yield ()
      }
