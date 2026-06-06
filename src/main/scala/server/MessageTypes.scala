package server
import zio.json.*
import javax.naming.spi.DirStateFactory.Result
import scala.collection.mutable.ArrayBuffer
import server.*
import java.util.UUID





final case class MessageType (
  msgType: String
)

object MessageType {
  implicit val decoder: JsonDecoder[MessageType] =
    DeriveJsonDecoder.gen[MessageType]
}

final case class ClientInfoMessage (
  msgType: String,
  clientId: UUID,
  lobbyId: UUID,
)

object ClientInfoMessage {
  implicit val encoder: JsonEncoder[ClientInfoMessage] =
    DeriveJsonEncoder.gen[ClientInfoMessage]
}

final case class RequestAttackOrderMessage (
  msgType: String,
  playerId: UUID,
  target_castle_id: UUID,
  selected_castles_ids: List[UUID],
  clientId: UUID,
  lobbyId: UUID
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
  players: ArrayBuffer[Player],
)

object BuildGameDataMessage {
implicit val encoder: JsonEncoder[BuildGameDataMessage] =
  DeriveJsonEncoder.gen[BuildGameDataMessage]
}

final case class UpdateData (
  id: UUID,
  playerId: Option[UUID],
  updatedPos: Option[Pos],
  state: Option[Int],
)

object UpdateData {
implicit val encoder: JsonEncoder[UpdateData] =
  DeriveJsonEncoder.gen[UpdateData]
}

final case class UpdatedGameDataMessage (
  msgType: String,
  updates: ArrayBuffer[UpdateData],
)

object UpdatedGameDataMessage {
implicit val encoder: JsonEncoder[UpdatedGameDataMessage] =
  DeriveJsonEncoder.gen[UpdatedGameDataMessage]
}
