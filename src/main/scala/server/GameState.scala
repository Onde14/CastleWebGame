package server
import scala.collection.mutable.ArrayBuffer
import scala.util.Random

class GameState:
  private var gameStarted = false
  private var players = ArrayBuffer[Int]()
  private val playerLimit: Int = 2
  private var testOrdersGiven = 0
  def isGameStarted: Boolean = this.gameStarted
  def changeGameStarted(): Unit = gameStarted = true
  def addPlayer(id: Int): Unit =
    if (players.size <= playerLimit)
      players += id
  def testOrdersAdd(): Unit =
    testOrdersGiven += 1
  def testGetOrders(): Int =
    testOrdersGiven
  def testOrdersReset(): Unit =
    testOrdersGiven = 0
  def buildGameState(): Unit =
    //val rand: Int = new Random()
    for (i <- 0 to playerLimit) print(i)
      players += Random.nextInt()
