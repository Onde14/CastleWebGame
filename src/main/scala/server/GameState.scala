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
import scala.compiletime.ops.double
import java.util.UUID
import scala.util.Random
import scala.util.Random




class GameState:
  private val height = GameConfig.height
  private val width = GameConfig.width
  private var gameStarted = false
  var mapData = ArrayBuffer[Player]()
 // var playersIds = ArrayBuffer[UUID]()
  private var castles = ArrayBuffer[Castle]()
  var soldiers = ArrayBuffer[Soldier]()
  var removedSoldiers = ArrayBuffer[Soldier]()
  var currentPlayersIds = ArrayBuffer[UUID]()
  private val playerLimit: Int = 2
  private var currentPlayerIterator: Int = 0
  val colors = List("blue","red")
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

  def getMap(): MapDataFile =
    println("Hello")

    val path = os.pwd/"src"/"main"/"scala"/"server"/"maps"/"demo.json"

    val mapContent = os.read(path).fromJson[MapDataFile]

    println("PATH: " + path)

    println("FILE: " + os.read(path))

    mapContent match
      case Right(value) =>
        println("JSON: " + value)
        return value
      case Left(value) =>
        println(s"Failed to decode map content $value")
    return null

  def calcDistance(pos1: Pos, pos2: Pos): Double =
    return (pos1.x - pos2.x).abs + (pos1.y - pos2.y).abs

  def buildGameState(clients: ArrayBuffer[UUID]): Unit =
    val mapFile = getMap()
    //val map = mapPositions(content.fromJson)
    println(s"MAP:  $mapFile")
    var i = 0
    for line <- mapFile.MapDataFile do
      val player = new Player(clients(i), colors(i), new ArrayBuffer[Castle], new ArrayBuffer[Soldier])
      val castle = new Castle(UUID.randomUUID(), clients(i), player.color,line.pos, 1, GameConfig.castleHealth, null)
      var villagesArray = new ArrayBuffer[Village]
      for j <- 1 until 4 do
        println("I: " +  i)
        println(s"CASTLE POS: ${castle.pos}")

        val r = GameConfig.villageSize*3
        val x = castle.pos.x + r * math.cos(120*(j)*math.Pi/180.0) + Random().between(0,GameConfig.villageSize)
        val y = castle.pos.y - r * math.sin(120*(j)*math.Pi/180.0) + Random().between(0,GameConfig.villageSize)
        val villagePos = new Pos(x,y)


        val village = new Village(UUID.randomUUID(), clients(i), villagePos)
        villagesArray += village
        println(s"buildGameState: castle.villages = ${castle.villages}")
      castle.villages = villagesArray.toList

      player.castles += castle
      castles += castle
      mapData += player
      i += 1
    println(s"mapData: $mapData")


    /*
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
    */
    //println(s"GAME BUILD: $availablePlayerSlots")

  def addPlayer(clientId: UUID) =
    if currentPlayersIds.size < playerLimit then
      currentPlayersIds += clientId

  def removePlayer(clientId: UUID): Unit =
    currentPlayersIds -= clientId
    println("PLAYER REMOVED")

  def damageStructures(castleId: UUID) =
    val castle = castles.find(c => c.id == castleId).get
    //castle.find(c => c.id == cas
    val newHealth = castle.health


  def createSoldier(playerId: UUID, target_castle_id: UUID, selected_castles_ids: List[UUID]):  ResponseAttackOrderMessage =


    val player: Player = mapData.find(_.id == playerId).get

    val new_soldiers = new ArrayBuffer[Soldier]()

    val target_castle: Castle = castles.find(_.id == target_castle_id).get


    val selected_castles_ids_set = selected_castles_ids.toSet
    val selected_castles = castles.filter(c => selected_castles_ids_set(c.id))
    for (castle <- selected_castles) {
      val soldier = new Soldier(UUID.randomUUID(), playerId, player.color, new Pos(castle.pos.x,castle.pos.y), target_castle.pos,castle.id,2)
      soldiers += soldier
      new_soldiers += soldier
      player.units += soldier
    }

    println(s"createSoldier: soldiers = $soldiers")
    val response: ResponseAttackOrderMessage = new ResponseAttackOrderMessage("ResponseAttackOrderMessage",new_soldiers.toList)
    println(s"createSoldier: CREATED SOLDIER AND RESPONSE: $response")

    return response

  def isSoldierInTarget(currPos: Pos, targetPos: Pos): Boolean =
    val distance = calcDistance(currPos, targetPos)
    if distance < 0.1 then
      return true
    else
      return false

  def areEnemiesTouching(soldier: Soldier): List[Soldier]  =
    val touchingSoldiers = soldiers.filter(s => (s.id != soldier.id && calcDistance(soldier.pos,s.pos) <= GameConfig.SoldierRadius && s.state != 0)).toList
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
        damageStructures(s.targetCastleId)
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
    //println(s"update: updates = $updates")
    val removedSoldiers = updates.filter(u => u.state.getOrElse(null) == 0)
    removeSoldiers(removedSoldiers)
    return updates
