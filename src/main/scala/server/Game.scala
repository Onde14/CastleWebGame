package server
import server.*
import zio._
import server.MainApp.validateEnv
import zio.stream._



class Game(gameState: GameState):
  var gameRunning = false;
  var runs = 0
