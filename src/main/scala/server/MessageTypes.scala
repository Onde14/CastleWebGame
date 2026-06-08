package server
import zio.json.*
import javax.naming.spi.DirStateFactory.Result
import scala.collection.mutable.ArrayBuffer
import server.*
import java.util.UUID

@jsonDiscriminator("msgType")
sealed trait Message
/* final case class Message(
  msgType: String,
  target_castle_id: Option[String],
  selected_castles_ids: Option[List[String]],
  clientId: Option[String],
  lobbyId: Option[String],
  status: Option[UUID],
  village: Option[List[Int]],
)
*/
object Message {
  implicit val decoder: JsonDecoder[Message] =
    DeriveJsonDecoder.gen[Message]
}

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
  target_castle_id: UUID,
  selected_castles_ids: List[UUID],
  clientId: UUID,
  lobbyId: UUID
) extends Message

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
  newOwner: Option[UUID],
  updatedPos: Option[Pos],
  state: Option[Int],
  health: Option[Int],

)

object UpdateData {
implicit val encoder: JsonEncoder[UpdateData] =
  DeriveJsonEncoder.gen[UpdateData]
}


final case class UpdatedGameDataMessage (
  msgType: String,
  updates: ArrayBuffer[UpdateData],
  tick: Int,
)

object UpdatedGameDataMessage {
implicit val encoder: JsonEncoder[UpdatedGameDataMessage] =
  DeriveJsonEncoder.gen[UpdatedGameDataMessage]
}
