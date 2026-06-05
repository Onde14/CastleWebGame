package server
import zio.json.*
import server.*
import scala.annotation.switch
import scala.collection.mutable.ArrayBuffer
import java.util.UUID

def outgoingMessageHandling(msgType: String, content: List[String]): String =
  msgType match
    case s"UpdatedGameDataMessage" =>
      return ""//UpdatedGameDataMessage("UpdatedGameState",updates).toJson
    case s"BuildGameDataMessage" =>
      return ""
    case s"initialClientInfoMessage" =>
      return ClientInfoMessage("ClientInfo", UUID.fromString(content(0)), UUID.fromString(content(1))).toJson
    case _ =>
      return ""

def incomingMessageHandling(msg: String): String =

  val msgType = msg.fromJson[MessageType]
  print(msgType)
  msgType match
    case Right(value) =>
      println("msgType: " + value.msgType)
      value.msgType match
        case s"AttackOrder" =>
          val attackOrder = msg.fromJson[RequestAttackOrderMessage]
          attackOrder match
            case Right(orderValue) =>
              val response = ""//gameState.createSoldier(orderValue.playerId, orderValue.target_castle_id, orderValue.selected_castles_ids)
              return response.toJson
            case Left(orderError) =>
              println(s"failed to decode: $orderError")
              return ""
        case _ =>
          return ""

    case Left(value) =>
      println(s"failed to decode: $value")
  /*

  */
  return ""
