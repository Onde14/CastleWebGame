package server

import java.util.UUID
import zio._
import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.ArrayBuffer


class temp(gameState: GameState, clients: ArrayBuffer[UUID]):
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
