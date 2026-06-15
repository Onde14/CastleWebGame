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
import scala.util.Random




class GameState:
  private val height = GameConfig.Height
  private val width = GameConfig.Width
  private var gameStarted = false
  var mapData = ArrayBuffer[Player]()
  var castles = ArrayBuffer[Castle]()
  var soldiers = ArrayBuffer[Soldier]()
  var removedSoldiers = ArrayBuffer[Soldier]()
  var currentPlayersIds = ArrayBuffer[UUID]()
  private val playerLimit: Int = 2
  private var currentPlayerIterator: Int = 0
  val colors = List("blue","red","green","purple","yellow","black")
  private val soldierSpeed = GameConfig.SoldierSpeed
  var winner: UUID = null
  var CPUs = new ArrayBuffer[Player]()

  def isGameStarted: Boolean = this.gameStarted
  def changeGameStarted(): Unit = gameStarted = true
  def getGameHeight(): Int =
    return height
  def getGameWidth(): Int =
    return width

  def getMap(): MapDataFile =

    val path = os.pwd/"src"/"main"/"scala"/"server"/"data"/"demo.json"

    val mapContent = os.read(path).fromJson[MapDataFile]

    //println("PATH: " + path)

   // println("FILE: " + os.read(path))

    mapContent match
      case Right(value) =>
        //println("JSON: " + value)
        return value
      case Left(value) =>
        //println(s"Failed to decode map content $value")
    return null

  def calcDistance(pos1: Pos, pos2: Pos): Double =
    return (pos1.x - pos2.x).abs + (pos1.y - pos2.y).abs

  def buildCPU(line: MapData, i: Int,clients: ArrayBuffer[UUID]) =
    val cpuId = UUID.randomUUID()
    val player = new Player(cpuId, colors(i), new ArrayBuffer[Castle], new ArrayBuffer[Soldier],0,true)
    val castle = new Castle(UUID.randomUUID(), cpuId, player.color,line.pos, 1, GameConfig.CastleHealth, null, null, line.id)
    var villagesArray = new ArrayBuffer[Village]
    for j <- 1 until 4 do
      //println("I: " +  i)
      //println(s"CASTLE POS: ${castle.pos}")

      val r = GameConfig.VillageSize*3
      val x = castle.pos.x + r * math.cos(120*(j)*math.Pi/180.0) + Random().between(0,GameConfig.VillageSize)
      val y = castle.pos.y - r * math.sin(120*(j)*math.Pi/180.0) + Random().between(0,GameConfig.VillageSize)
      val villagePos = new Pos(x,y)


      val village = new Village(UUID.randomUUID(), cpuId, villagePos)
      villagesArray += village
      //println(s"buildGameState: castle.villages = ${castle.villages}")
    castle.villages = villagesArray.toList

    player.castles += castle
    castles += castle
    CPUs += player
    mapData += player

  def buildPlayer(line: MapData, i: Int,clients: ArrayBuffer[UUID]) =
    val player = new Player(clients(i), colors(i), new ArrayBuffer[Castle], new ArrayBuffer[Soldier],0,false)

    val castle = new Castle(UUID.randomUUID(), clients(i), player.color,line.pos, 1, GameConfig.CastleHealth, null, null, line.id)
    var villagesArray = new ArrayBuffer[Village]
    for j <- 1 until 4 do
      //println("I: " +  i)
      //println(s"CASTLE POS: ${castle.pos}")

      val r = GameConfig.VillageSize*3
      val x = castle.pos.x + r * math.cos(120*(j)*math.Pi/180.0) + Random().between(0,GameConfig.VillageSize)
      val y = castle.pos.y - r * math.sin(120*(j)*math.Pi/180.0) + Random().between(0,GameConfig.VillageSize)
      val villagePos = new Pos(x,y)


      val village = new Village(UUID.randomUUID(), clients(i), villagePos)
      villagesArray += village
      //println(s"buildGameState: castle.villages = ${castle.villages}")
    castle.villages = villagesArray.toList

    player.castles += castle
    castles += castle
    mapData += player



  def buildGameState(clients: ArrayBuffer[UUID]): Unit =
    val mapFile = getMap()
    //val map = mapPositions(content.fromJson)
   // println(s"MAP:  $mapFile")
    var i = 0
    for line <- mapFile.MapDataFile do
      if clients.size > i then
       // println("HELLO")
        buildPlayer(line, i, clients)
      else
     //   println("HELLO")
        buildCPU(line, i,clients)
      i += 1
    for line <- mapFile.MapDataFile do

      val castle = castles.find(c => c.mapFileId == line.id).get
      if castle != null then
       // println("castle: " + castle)
        var connections = new ArrayBuffer[UUID]();
        for conn <- line.connections do

          val c = castles.find(c => c.mapFileId == conn).getOrElse(null)

          if c != null then

            connections += c.id

        castle.connections = connections.toList

  def addPlayer(clientId: UUID) =
    if currentPlayersIds.size < playerLimit then
      currentPlayersIds += clientId

  def removePlayer(clientId: UUID): Unit =
    currentPlayersIds -= clientId
    //println("PLAYER REMOVED")

  def resetGameState() =
    gameStarted = false
    mapData = ArrayBuffer[Player]()
    castles = ArrayBuffer[Castle]()
    soldiers = ArrayBuffer[Soldier]()
    removedSoldiers = ArrayBuffer[Soldier]()
    currentPlayersIds = ArrayBuffer[UUID]()
    currentPlayerIterator = 0
    CPUs = new ArrayBuffer[Player]()


  def isGameWon(): Boolean =
    val owner = castles(0).owner
    //println(s"owner: $owner")
    val oneOwnerCastle = castles.find(c1 => c1.owner != owner).getOrElse(null)

    //println(s"oneOwnerCastle: $oneOwnerCastle")
    if oneOwnerCastle == null then
      winner = owner
      resetGameState()
      return true
    return false

  def damageStructures(soldier: Soldier): UpdateData =
    val castle = castles.find(c => c.id == soldier.targetCastleId && c.owner != soldier.owner).getOrElse(return null)
    val villages = castle.villages.filter(v => v.state == 1)
    if (villages.nonEmpty) then
      val damagedVillage = villages(0)


      damagedVillage.health = damagedVillage.health - GameConfig.SoldierDamage

      if damagedVillage.health <= 0 then
        damagedVillage.state = 0

        return new UpdateData(damagedVillage.id,Option(castle.owner),Option(null),Option(null),Option(damagedVillage.state),Option(null),Option(null))
      else

        return new UpdateData(damagedVillage.id,Option(castle.owner),Option(null),Option(null),Option(null),Option(damagedVillage.health),Option(null))
    else
      castle.health = castle.health - GameConfig.SoldierDamage
      if castle.health <= 0 then
        val castleOwner = mapData.find(p => p.id == castle.owner).get
        castleOwner.castles -= castle
        val newOwner = mapData.find(p => p.id == soldier.owner).get
        newOwner.castles += castle
        castle.health = GameConfig.CastleHealth
        val update = new UpdateData(castle.id,Option(castle.owner),Option(soldier.owner),Option(null),Option(3), Option(castle.health),Option(null))
        castle.owner = soldier.owner
        castle.ownerColor = soldier.ownerColor
        castle.villages.foreach(v => v.owner = soldier.owner)
        return update
      else
        return new UpdateData(castle.id,Option(castle.owner),Option(null),Option(null),Option(null),Option(castle.health),Option(null))


  def createSoldiers(playerId: UUID, target_castle_id: UUID, selected_castles_ids: List[UUID]):  ResponseAttackOrderMessage =

    val player: Player = mapData.find(_.id == playerId).get
    if (player.money < selected_castles_ids.length) then
      //println(s"player.money < selected_castles_ids.length: ${player.money},${selected_castles_ids}")
      val res: ResponseAttackOrderMessage = null
      return res;

    val new_soldiers = new ArrayBuffer[Soldier]()

    val target_castle: Castle = castles.find(_.id == target_castle_id).get


    val selected_castles_ids_set = selected_castles_ids.toSet
    val selected_castles = castles.filter(c => selected_castles_ids_set(c.id))
    for (castle <- selected_castles) {
      val soldier = new Soldier(UUID.randomUUID(), playerId, player.color, new Pos(castle.pos.x,castle.pos.y), target_castle.pos,target_castle.id,2)
      soldiers += soldier
      new_soldiers += soldier
      player.units += soldier
      player.money -= 1
    }

    //println(s"createSoldier: soldiers = $soldiers")
    val response: ResponseAttackOrderMessage = new ResponseAttackOrderMessage("ResponseAttackOrderMessage",new_soldiers.toList,player.money)
    //println(s"createSoldier: CREATED SOLDIER AND RESPONSE: $response")

    return response

  def isSoldierInTarget(currPos: Pos, targetPos: Pos): Boolean =
    val distance = calcDistance(currPos, targetPos)
    if distance < 0.1 then
      return true
    else
      return false

  def areEnemiesTouching(soldier: Soldier): List[Soldier]  =
    val touchingSoldiers = soldiers.filter(s => (s.id != soldier.id && s.owner != soldier.owner && calcDistance(soldier.pos,s.pos) <= GameConfig.SoldierRadius && s.state != 0)).toList
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
        val damageUpdates = damageStructures(s)
        if damageUpdates != null then
          updates += damageUpdates


      else
        s.pos.x = moveCalcX(s.pos.x, s.target.x)
        s.pos.y = moveCalcY(s.pos.y, s.target.y)
      if s.state != 0 then
        val touchingSoldiers = areEnemiesTouching(s)
        if touchingSoldiers.nonEmpty then
          touchingSoldiers.foreach(ts =>
            ts.state = 0
            updates += new UpdateData(ts.id,Option(ts.owner),Option(null),Option(ts.pos),Option(ts.state),Option(null),Option(null))
          )
          s.state = 0
          updates += new UpdateData(s.id,Option(s.owner),Option(null),Option(s.pos),Option(s.state),Option(null),Option(null))
      if s.state == 2 then
        updates += new UpdateData(s.id,Option(null),Option(null),Option(s.pos),Option(s.state),Option(null),Option(null))
    )

    return updates


  def removeSoldiers(): Unit =
    val newArray = soldiers.filter(s => s.state != 0)
    soldiers = newArray
    //println(s"removeSoldiers(): SOLDIERS = $soldiers")

  def calcMoney(updates: ArrayBuffer[UpdateData]) =
    mapData.foreach(p => {
      var countMoney = 0
      p.castles.foreach(c => {
        countMoney += c.villages.filter(v => v.state == 1).length
        if (c.state == 1) countMoney += 1
      })
      updates += new UpdateData(p.id,Option(null),Option(null),Option(null),Option(null),Option(null),Option(countMoney))
      p.money += countMoney
      //println(s"p.money ${p.money}, countMoney ${countMoney}")
    })

  def CPUStrategy(): CPUUpdateData =
    val cpu = Random.shuffle(CPUs).head
    //println("cpu: " + cpu)
    if (cpu.money <= 0) then return null
    //println("cpu.money: " + cpu.money)
    //println("cpu.castles: " + cpu.castles)
    if cpu.castles.isEmpty then return null
    val castle = Random.shuffle(cpu.castles).head
    //println("castle: " + castle)
    val targets = castles.filter(enemyCas => enemyCas.owner != cpu.id)
    if targets.isEmpty then return null
    val target = Random.shuffle(targets).head
    //println("target: " + target)
    if target != null then
      var selected = new ArrayBuffer[UUID]()
      cpu.castles.foreach(c => selected += c.id)
      if (cpu.money >= selected.size) then
        //println(s"${cpu.id} + ${target.id} + ${selected.toList} + ${castle}")
        val response: ResponseAttackOrderMessage = createSoldiers(cpu.id,target.id,selected.toList)
        if response != null then
          val cpuUpdate = new CPUUpdateData ("CPUUpdateDataMessage",6,cpu.money,response.soldiers.toList)
         // println(response)
          return cpuUpdate
        else return null
      else return null
    else return null

  def cpuUpdate(tick: Int): CPUUpdateData =
      var res = CPUStrategy()
      res

  def update(tick: Int): ArrayBuffer[UpdateData] =

    val updates: ArrayBuffer[UpdateData] = moveSoldiers()
    //println("update")
    //println(s"update: updates = $updates")
    removeSoldiers()

    //println("updates: " + updates)
    return updates
