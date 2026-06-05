package server
import scala.collection.mutable.ArrayBuffer
import server.*
import scala.util.Random
import scala.compiletime.ops.boolean
import org.scalajs.ir.Types.NothingType
import zio._
import zio.http._
import os.*
import zio.json.*




class GameState:
  private val height = 1000
  private val width = 1000
  private var gameStarted = false
  var availablePlayerSlots = ArrayBuffer[Player]()
  private var castles = ArrayBuffer[Castle]()
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

  def getMap() =
    println("Hello")

    val path = os.pwd/"src"/"main"/"scala"/"server"/"maps"/"demo.json"
    println("Hello")

    val mapContent = os.read(path).fromJson[MapDataFile]

    println("PATH: " + path)
    println("Hello")

    println("FILE: " + os.read(path))
    println("Hello")

    mapContent match
      case Right(value) =>
        println("JSON: " + value)

      case Left(value) =>
        println(s"Failed to decode map content $value")


  def buildGameState(): Unit =
    println("Hello")
    getMap()
    //val map = mapPositions(content.fromJson)

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
    //println(s"GAME BUILD: $availablePlayerSlots")


  def getPlayers(): ArrayBuffer[Player] =
    return availablePlayerSlots

  def addPlayer(): Player =
    println(currentPlayerIterator)
    println(playerLimit)
    if currentPlayerIterator < playerLimit then
      val player = availablePlayerSlots(currentPlayerIterator)
      currentPlayers += player
      currentPlayerIterator += 1
      println(s"ADDED PLAYER: $player, PLAYER LIMIT: $playerLimit, CURRENT PLAYER AMOUNT: $currentPlayerIterator")
      return player
    else
      println("ERROR: too many players!")
      return null

  def removePlayer(): Unit =
    currentPlayers -= currentPlayers(0)
    currentPlayerIterator -= 1
    println("PLAYER REMOVED")

  def createSoldier(playerId: Int, target_castle_id: Int, selected_castles_ids: List[Int]): ResponseAttackOrderMessage =


    val player: Player = currentPlayers.filter(_.id == playerId)(0)
    val new_soldiers = new ArrayBuffer[Soldier]()

    val target_castle: Castle = castles.filter(_.id == target_castle_id)(0)
    val selected_castles_ids_set = selected_castles_ids.toSet
    val selected_castles = castles.filter(c => selected_castles_ids_set(c.id))
    for (castle <- selected_castles) {
      val soldier = new Soldier(Random.between(0,100000), playerId, player.color, new Pos(castle.pos.x,castle.pos.y), target_castle.pos,2)
      soldiers += soldier
      new_soldiers += soldier
      player.units += soldier
    }
    val response: ResponseAttackOrderMessage = new ResponseAttackOrderMessage("AttackOrder",new_soldiers.toList)
    //println(s"CREATED SOLDIER AND RESPONSE: $response")
    return response

  def calcDistance(pos1: Pos, pos2: Pos): Double =
    return (pos1.x - pos2.x).abs + (pos1.y - pos2.y).abs

  def isSoldierInTarget(currPos: Pos, targetPos: Pos): Boolean =
    val distance = calcDistance(currPos, targetPos)
    if distance < 0.1 then
      return true
    else
      return false

  def areEnemiesTouching(soldier: Soldier): List[Soldier]  =
    val touchingSoldiers = soldiers.filter(s => (s.id != soldier.id && calcDistance(soldier.pos,s.pos) <= soldier.radius && s.state != 0)).toList
    return touchingSoldiers


  def moveCalcX(currX: Double, targetX: Double): Double =

    if (currX > targetX) then
      return currX - soldierSpeed
    else if currX < targetX then
      return currX + soldierSpeed
    else
      return currX


  def moveCalcY(currY: Double, targetY: Double): Double =
    if (currY > targetY) then
      return currY - soldierSpeed
    else if currY < targetY then
      return currY + soldierSpeed
    else
      return currY

  def moveSoldiers(): ArrayBuffer[UpdateData] =
    var updates = ArrayBuffer[UpdateData]()
    soldiers.foreach(s =>
      val foundTarget = isSoldierInTarget(s.pos,s.target)
      if foundTarget then
        s.state = 0
      else
        s.pos.x = moveCalcX(s.pos.x, s.target.x)
        s.pos.y = moveCalcY(s.pos.y, s.target.y)
      if s.state != 0 then
        val touchingSoldiers = areEnemiesTouching(s)
        if touchingSoldiers.nonEmpty then
          touchingSoldiers.foreach(ts =>
            ts.state = 0
            updates += new UpdateData(ts.id,Option(ts.owner),Option(ts.pos),Option(ts.state))
          )
          s.state = 0
      s.state match
        case 0 =>
          updates += new UpdateData(s.id,Option(s.owner),Option(s.pos),Option(s.state))
        case 2 =>
          updates += new UpdateData(s.id,Option(null),Option(s.pos),Option(s.state))
    )
    return updates

  def removeSoldiers(updates: ArrayBuffer[UpdateData]): Unit =
    updates.foreach(u =>
      //println(s"REMOVING SOLDIER: ${u.id}")
      //println(s"Soldiers list $soldiers")
      val tempSoldiers = soldiers.toList
      tempSoldiers.foreach(s =>
        if u.id == s.id then
          soldiers -= s
      )
      //println(s"Soldiers list $soldiers")
    )


  def update(): ArrayBuffer[UpdateData] =
    val updates = moveSoldiers()
    val removedSoldiers = updates.filter(u => u.state.getOrElse(null) == 0)
    removeSoldiers(removedSoldiers)
    return updates
