package server
import scala.collection.mutable.ArrayBuffer
import server.*
import scala.util.Random

class GameState:
  private val height = 500
  private val width = 500
  private var gameStarted = false
  private var availablePlayerSlots = ArrayBuffer[Player]()
  private var castles = ArrayBuffer[Castle]()
  private var troops = ArrayBuffer[Troop]()
  private var currentPlayers = ArrayBuffer[Player]()
  private val playerLimit: Int = 2
  private var currentPlayerIterator: Int = 0
  private var testOrdersGiven = 0
  def isGameStarted: Boolean = this.gameStarted
  def changeGameStarted(): Unit = gameStarted = true
  def testOrdersAdd(): Unit =
    testOrdersGiven += 1
  def testGetOrders(): Int =
    testOrdersGiven
  def testOrdersReset(): Unit =
    testOrdersGiven = 0
  def getGameHeight(): Int =
    return height
  def getGameWidth(): Int =
    return width


  def buildGameState(): Unit =
    val player1 = new Player(Random.nextInt(), "blue", new ArrayBuffer[Castle](), new ArrayBuffer[Unit]())
    availablePlayerSlots += player1
    val castle1 = new Castle(Random.nextInt(), player1.id, List(width/2,height-100))
    castles += castle1
    player1.castles += castle1
    val player2 = new Player(Random.nextInt(), "red", new ArrayBuffer[Castle](), new ArrayBuffer[Unit]())
    availablePlayerSlots += player2
    val castle2 = new Castle(Random.nextInt(), player2.id, List(width/2,height-100))
    player2.castles += castle2


  def addPlayer(): Player =
    println(currentPlayerIterator)
    println(playerLimit)
    if currentPlayerIterator < playerLimit then
      val player = availablePlayerSlots(currentPlayerIterator)
      currentPlayers += player
      currentPlayerIterator += 1
      return player
    else
      println("ERROR: too many players!")
      return null

  def removePlayer(id: Int): Unit =
    currentPlayers.filter(_.id != id)

  def createTrooper(id: Int, startx: Int, starty: Int, targetx: Int, targety: Int): Unit =
    val troop = new Troop(Random.nextInt(), id, List(startx,starty), List(targetx,targety))
    troops += troop
