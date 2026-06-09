package server

import java.util.UUID
import zio._
import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.ArrayBuffer
import server.*
import zio.stream._
import zio.http.ChannelEvent.{ExceptionCaught, Read, UserEvent, UserEventTriggered}
import zio.http._
import zio.json.*






class Lobby(h: Hub[String],g: GameState):
  val id = UUID.randomUUID()
  val hub = h
  val gameState = g
  var clients = ArrayBuffer.empty[UUID]
  var currSize = 0
  val maxSize = 2
  var started = false
  var running = false
  var ended = false
  var isFull = false
  var runGameFiber: Fiber.Runtime[Nothing, Unit] = null
  var tick = 0;

  def setStatus() =
    if running then
      if currSize < 2 then
        ended = true
    else
      if clients.isEmpty then
        ended = true

  def checkSize() =
    println(s"checkSize: currSize = $currSize, maxSize = $maxSize")
    if currSize == maxSize then isFull = true else isFull = false
  def addClient(id: UUID) =
    if currSize < maxSize then
      clients += id
      currSize += 1
      checkSize()
  def removeClient(id: UUID) =
    clients -= id
    currSize -= 1
    checkSize()
    setStatus()

  def startGame(lobbiesRef: Ref[Set[Lobby]]) =
    for {
      running = true
      runGameFiber <- runGame(lobbiesRef).forever
    } yield runGameFiber

  def buildGame() =
    gameState.buildGameState(clients)
    //return gameState.availablePlayerSlots


  def runGame(lobbiesRef: Ref[Set[Lobby]]) =
      println("START GAME!")
        for {
          gameStatus <- ZIO.succeed(gameState.isGameWon())
          //_ <- ZIO.debug(gameStatus)
          _ <- ZIO.when(gameStatus){
            for {
              _ <- ZIO.debug(s"GAME $id IS DONE:")
              _ <- hub.publish(GameEndMessage("GameEndMessage",gameState.winner).toJson)
              _ <- lobbiesRef.update(_ - this)
              _ <- ZIO.interrupt
            } yield ()
          }
          updates <- ZIO.succeed(gameState.update())
          response <- ZIO.succeed(UpdatedGameDataMessage("UpdatedGameState",updates,tick).toJson)
          _ <- ZIO.succeed(if tick % 401 == 0 && tick != 0 then tick = 0 else tick += 1)


          _ <- ZIO.when(response != null) (hub.publish(response))
        // _ <- ZIO.succeed(gameState.changes.clear())
        // _ <- ZIO.debug(gameState.availablePlayerSlots)
         // _ <- ZIO.debug(s"RUNNING: $running")
          //_ <- ZIO.debug(s"$id: Tick")
          _ <- ZIO.sleep(16.millis)
       //  _ <- ZIO.debug(s"$id: Tick")
        } yield ()
  def publish() =
    for {
      hub <- ZIO.service[Hub[String]]
    } yield ()


  /*def publish(message: String, channel:  Channel[ChannelEvent[WebSocketFrame], ChannelEvent[WebSocketFrame]]) =
    ZIO.scoped {
      for {
        hub <- ZIO.service[Hub[String]]
        queue <- hub.subscribe
        outgoing <- ZStream
          .fromQueue(queue)
          .map(WebSocketFrame.text)
          .runForeach(frame => channel.send(Read(frame))
        _ <- hub.publish


      } yield ()
    }
 */







/*
class Lobby (gameState: GameState, clients: ArrayBuffer[UUID]):
  var id: UUID = null
  var currSize = 0
  val maxSize = 2
  var started = false
  var isFull = false
  var clientsArray = clients
  def checkSize() =
    println("SIZES: " + currSize +  maxSize)
    if currSize == maxSize then isFull = true else isFull = false
  def addClient(id: UUID) =
    clientsArray += id
    currSize += 1
    checkSize()
  def removeClient(id: UUID) =
    clientsArray -= id
    currSize -= 1
    checkSize()
  def startGame() =
    runGame().forkDaemon
  def runGame() =
      println("START GAME!")
      ZIO.scoped{
        for {
          hub <- ZIO.service[Hub[String]]
          updates <- ZIO.succeed(gameState.update())
          //_ <- if updates.nonEmpty then hub.publish(outgoingMessageHandling("update",updates)) else ZIO.unit
        // _ <- ZIO.succeed(gameState.changes.clear())
        // _ <- ZIO.debug(gameState.availablePlayerSlots)
          _ <- ZIO.sleep(16.millis)
        } yield ()
      }
*/