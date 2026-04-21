package server
import scala.collection.mutable.ArrayBuffer

class GameState:
  private var gameStarted = false
  private var players = ArrayBuffer[Int]()
  private val playerLimit = 2
  def isGameStarted: Boolean = this.gameStarted
  def changeGameStarted(): Unit = gameStarted = true
  def addPlayer(id: Int): Unit =
    if (players.size <= playerLimit)
      players += id
