package server
import zio.json.*
import server.*
import scala.annotation.switch
import scala.collection.mutable.ArrayBuffer
import java.util.UUID
import zio.stream._
import zio.http.ChannelEvent.{ExceptionCaught, Read, UserEvent, UserEventTriggered}
import zio.http._
import zio._





def outgoingMessageHandling(msgType: String, content: List[String]): String =
  msgType match
    case s"UpdatedGameDataMessage" =>
      return ""//UpdatedGameDataMessage("UpdatedGameState",updates).toJson
    case s"BuildGameDataMessage" =>
      return ""
    case s"ClientInfoMessage" =>
      return ClientInfoMessage("ClientInfo", UUID.fromString(content(0)), UUID.fromString(content(1))).toJson
    case _ =>
      return ""

def incomingMessageHandling(msg: String): Message =
/*
  val msgType = msg.fromJson[MessageType]
  //print(msgType)
  msgType match
    case Right(value) =>
      //println("msgType: " + value.msgType)
      value.toString() match
        case s"RequestAttackOrderMessage" =>
          val attackOrder = msg.fromJson[RequestAttackOrderMessage]
          attackOrder match
            case Right(orderValue) =>
              //gameState.createSoldier(orderValue.playerId, orderValue.target_castle_id, orderValue.selected_castles_ids)
              return orderValue
            case Left(orderError) =>
              println(s"failed to decode: $orderError")
              return null
        case _ =>
          return null

    case Left(value) =>
      println(s"failed to decode: $value")




  */
  return null


def RequestAttackOrderMessageHandling(target_castle_id: UUID,
  selected_castles_ids: List[UUID],
  clientId: UUID,
  lobby: Lobby,
  channel: Channel[ChannelEvent[WebSocketFrame],ChannelEvent[WebSocketFrame]]) =
  for {
    response <- ZIO.succeed(lobby.gameState.createSoldier(clientId,target_castle_id,selected_castles_ids).toJson)
    _ <- lobby.hub.publish(response)
  } yield ()
    /*newLobbyout = ZStream
      .fromQueue(lobbyQueue)
      .map(WebSocketFrame.text)
      .runForeach(frame => {
      println(s"FRAME: $frame")
      channel.send(Read(frame))
    }).forkDaemon
    _ <- ZIO.debug("lobbyout: " + newLobbyout)
    _ <- newLobbyout
    _ <- ZIO.debug("lobbyout: " + newLobbyout)*/

