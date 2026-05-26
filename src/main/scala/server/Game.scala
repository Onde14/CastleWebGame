package server
import server.*
import zio._


class Game:
  private var gameRunning = false;
  val gameState: GameState = new GameState()
  def runGame(): ZIO[Any, Nothing, Long] =
    println("WhAT")
    ZIO
      .debug("Game still running!")
      .repeat(Schedule.fixed(1.seconds))

  def startGame(): ZIO[Any, Nothing, Unit] =
    gameRunning = true
    for {
      _ <- ZIO.debug("Game Started!")
      _ <- runGame().fork
      _ <- ZIO.sleep(10.seconds)//if (gameRunning == true) then ZIO.repeat((Schedule.fixed(1.seconds)))
      _ <- ZIO.debug("Game Stopped!")
    } yield println("Game Stopped!")

  def closeGame(): Unit =
    gameRunning = false
