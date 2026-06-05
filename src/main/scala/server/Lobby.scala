package server

import java.util.UUID
import zio._
import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.ArrayBuffer
import server.*


class Lobby(h: Hub[String],g: GameState):
  val id = UUID.randomUUID()
  val hub = h
  val gameState = g
  var clients = Set.empty[UUID]

  //var id: UUID = null
  var currSize = 0
  val maxSize = 2
  var started = false
  var ended = false
  var isFull = false
  def setStatus() =
    if currSize < 2 then
      ended = true

  def checkSize() =
    println("SIZES: " + currSize +  maxSize)
    if currSize == maxSize then isFull = true else isFull = false
  def addClient(id: UUID) =
    clients += id
    currSize += 1
    checkSize()
  def removeClient(id: UUID) =
    clients -= id
    currSize -= 1
    checkSize()
    setStatus()


  def buildGame() =
    gameState.buildGameState()
    //return gameState.availablePlayerSlots
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