package server
import zio.json.*
import javax.naming.spi.DirStateFactory.Result
import scala.collection.mutable.ArrayBuffer
import server.*




final case class MessageType (
  msgType: String
)

object MessageType {
  implicit val decoder: JsonDecoder[MessageType] =
    DeriveJsonDecoder.gen[MessageType]
}

final case class RequestAttackOrderMessage (
  msgType: String,
  playerId: Int,
  target_castle_id: Int,
  selected_castles_ids: List[Int],
)

object RequestAttackOrderMessage {
  implicit val encoder: JsonEncoder[RequestAttackOrderMessage] =
    DeriveJsonEncoder.gen[RequestAttackOrderMessage]
  implicit val decoder: JsonDecoder[RequestAttackOrderMessage] =
    DeriveJsonDecoder.gen[RequestAttackOrderMessage]
}

final case class ResponseAttackOrderMessage (
  msgType: String,
  soldiers: List[Soldier],
)

object ResponseAttackOrderMessage {
  implicit val encoder: JsonEncoder[ResponseAttackOrderMessage] =
    DeriveJsonEncoder.gen[ResponseAttackOrderMessage]
  implicit val decoder: JsonDecoder[ResponseAttackOrderMessage] =
    DeriveJsonDecoder.gen[ResponseAttackOrderMessage]
}

final case class BuildGameDataMessage (
  msgType: String,
  currentPlayerId: Int,
  players: ArrayBuffer[Player],
)

object BuildGameDataMessage {
implicit val encoder: JsonEncoder[BuildGameDataMessage] =
  DeriveJsonEncoder.gen[BuildGameDataMessage]
}

final case class UpdatedGameDataMessage (
  msgType: String,
  updates: ArrayBuffer[GameObject],
)

object UpdatedGameDataMessage {
implicit val encoder: JsonEncoder[UpdatedGameDataMessage] =
  DeriveJsonEncoder.gen[UpdatedGameDataMessage]
}
