package server
import zio.json.*
import server.*
import scala.annotation.switch
import scala.collection.mutable.ArrayBuffer



def outgoingMessageHandling(msgType: String, changes: ArrayBuffer[GameObject]): String =
  msgType match
    case s"update" =>
      return UpdatedGameDataMessage("UpdatedGameState",changes).toJson

    case _ =>
      return ""

def incomingMessageHandling(msg: String, gameState: GameState): String =

  val msgType = msg.fromJson[MessageType]
  msgType match
    case Right(value) =>
      println("msgType: " + value.msgType)
      value.msgType match
        case s"AttackOrder" =>
          val attackOrder = msg.fromJson[RequestAttackOrderMessage]
          attackOrder match
            case Right(orderValue) =>
              val response = gameState.createSoldier(orderValue.playerId, orderValue.target_castle_id, orderValue.selected_castles_ids)
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
