package server
import zio.json.*
import server.*
import scala.annotation.switch


def outgoingMessageHandling(msgType: String, gameState: GameState): String =
  msgType match
    case s"update" =>
      return UpdatedGameData("UpdatedGameState",gameState.currentPlayers).toJson


    case _ =>
      return ""

def incomingMessageHandling(msg: String, gameState: GameState): String =

  val msgType = msg.fromJson[MessageType]
  msgType match
    case Right(value) =>
      println("msgType: " + value.msgType)
      value.msgType match
        case s"AttackOrder" =>
          val attackOrder = msg.fromJson[RequestAttackOrder]
          attackOrder match
            case Right(orderValue) =>
              val playerId = orderValue.playerId
              val target_castle = orderValue.target_castle
              val selected_castles = orderValue.selected_castles
              val response = gameState.createSoldier(playerId, target_castle, selected_castles)
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
