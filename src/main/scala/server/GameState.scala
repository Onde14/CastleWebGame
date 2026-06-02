package server
import scala.collection.mutable.ArrayBuffer
import server.*
import scala.util.Random
import scala.compiletime.ops.boolean
import org.scalajs.ir.Types.NothingType
import zio.ZIO

class GameState:
  private val height = 500
  private val width = 500
  private var gameStarted = false
  var availablePlayerSlots = ArrayBuffer[Player]()
  private var castles = ArrayBuffer[Castle]()
  var changes = ArrayBuffer[GameObject]()
  var soldiers = ArrayBuffer[Soldier]()
  var removedSoldiers = ArrayBuffer[Soldier]()
  var currentPlayers = ArrayBuffer[Player]()
  private val playerLimit: Int = 2
  private var currentPlayerIterator: Int = 0
  private var testOrdersGiven = 0
  private val soldierSpeed = 2.5

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
    val player1 = new Player(Random.between(0, 100000), "blue", new ArrayBuffer[Castle](), new ArrayBuffer[Soldier]())
    availablePlayerSlots += player1
    val castle1 = new Castle(Random.between(0, 100000), player1.id, player1.color, new Pos(width/2,height-100),1)
    castles += castle1
    player1.castles += castle1
    val player2 = new Player(Random.between(0, 100000), "red", new ArrayBuffer[Castle](), new ArrayBuffer[Soldier]())
    availablePlayerSlots += player2
    val castle2 = new Castle(Random.between(0, 100000), player2.id, player2.color, new Pos(width/2,100),1)
    castles += castle2
    player2.castles += castle2


  def getPlayers(): ArrayBuffer[Player] =
    return availablePlayerSlots

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

  def createSoldier(playerId: Int, target_castle_id: Int, selected_castles_ids: List[Int]): ResponseAttackOrderMessage =


    val player: Player = currentPlayers.filter(_.id == playerId)(0)
    val new_soldiers = new ArrayBuffer[Soldier]()
    println(s"WHATSUP $castles")

    val target_castle: Castle = castles.filter(_.id == target_castle_id)(0)
    val selected_castles_ids_set = selected_castles_ids.toSet
    val selected_castles = castles.filter(c => selected_castles_ids_set(c.id))
    for (castle <- selected_castles) {
      val soldier = new Soldier(Random.between(0,100000), playerId, player.color, castle.pos, target_castle.pos,2)
      soldiers += soldier
      new_soldiers += soldier
      player.units += soldier
    }
    val response: ResponseAttackOrderMessage = new ResponseAttackOrderMessage("AttackOrder",new_soldiers.toList)
    return response


  def isSoldierInTarget(currPos: Pos, targetPos: Pos): Boolean =
    val distance = (currPos.x - targetPos.x).abs + (currPos.y - targetPos.y).abs
    if distance < 0.1 then
      return true
    else
      return false

  def moveCalcX(currX: Double, targetX: Double): Double =
    if (currX > targetX) then
      return currX - soldierSpeed
    else
      return currX + soldierSpeed


  def moveCalcY(currY: Double, targetY: Double): Double =
    if (currY > targetY) then
      return currY - soldierSpeed
    else
      return currY + soldierSpeed

  def moveSoldiers(): Unit =
    soldiers.foreach(s =>
      val foundTarget = isSoldierInTarget(s.pos,s.target)
      if foundTarget then
        removedSoldiers += s
      else
        s.pos.x = moveCalcX(s.pos.x, s.target.x)
        s.pos.y = moveCalcY(s.pos.y, s.target.y)
      changes += s
    )
    removedSoldiers.foreach(s =>
      soldiers -= s
    )

  def update() =
    moveSoldiers()
