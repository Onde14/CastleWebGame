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
      if currSize + gameState.CPUs.length < 2 then
        ended = true
    else
      if clients.isEmpty then
        ended = true

  def checkSize() =
    //println(s"checkSize: currSize = $currSize, maxSize = $maxSize")
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
    running = true
    for {
      runGameFiber <- runGame(lobbiesRef)
    } yield runGameFiber

  def buildGame() =
    gameState.buildGameState(clients)
    //return gameState.availablePlayerSlots
    //




  def runGame(lobbiesRef: Ref[Set[Lobby]]) =
    println("START GAME!")
      for {
        _ <- (
          for {
            gameStatus <- ZIO.succeed(gameState.isGameWon())
            _ <- ZIO.when(gameStatus){
              for {
                _ <- ZIO.debug(s"GAME $id IS DONE1:")
                _ <- hub.publish(GameEndMessage("GameEndMessage",gameState.winner).toJson)
                _ <- lobbiesRef.update(_ - this)
                _ <- ZIO.interrupt
              } yield ()
            }
            gameStatus <- ZIO.succeed(clients.size < 2 && gameState.CPUs.size == 0)
            _ <- ZIO.when(gameStatus){
              for {
                _ <- ZIO.debug(s"GAME $id IS DONE2:")
                response <- ZIO.when(clients.size == 1) {
                  for {
                    _ <- ZIO.debug(s"clients(0): ${clients(0)}")
                    response = GameEndMessage("GameEndMessage",clients(0)).toJson
                    _ <- ZIO.debug(s"response: ${response}")
                  } yield response
                }
                res <- ZIO.succeed(response.get)
                _ <- ZIO.debug("res:",res)

                _ <- hub.publish(res)
                _ <- lobbiesRef.update(_ - this)
                _ <- ZIO.interrupt
              } yield ()
            }






            updates <- ZIO.succeed(gameState.update(tick))
            _ <- ZIO.fromEither(Right(if tick % 401 == 0 && tick != 0 then
              gameState.calcMoney(updates)
              tick = 0
            ))
            response <- ZIO.succeed(UpdatedGameDataMessage("UpdatedGameState",updates.toList,tick).toJson)
            _ <- ZIO.succeed(tick += 1)

            _ <- ZIO.when(response != null) (hub.publish(response))
          // _ <- ZIO.succeed(gameState.changes.clear())
          // _ <- ZIO.debug(gameState.availablePlayerSlots)
          // _ <- ZIO.debug(s"RUNNING: $running")
            //_ <- ZIO.debug(s"$id: Tick")
            //_ <- ZIO.debug(s"Tick: $tick")

            cpuUpdate <- ZIO.when(tick % 50 == 0) (ZIO.succeed(gameState.cpuUpdate(tick)))
           // _ <- ZIO.debug("DEBUG: " + Some(cpuUpdate))
            _ <- ZIO.when(cpuUpdate != Some(null) && cpuUpdate != None && cpuUpdate != Some(None))(hub.publish(cpuUpdate.toJson))
          } yield ()
        ).repeat(Schedule.fixed(16.millis))
      } yield ()
