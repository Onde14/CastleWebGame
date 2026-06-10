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

final case class ClientTick (
  msgType: String,
  clientId: UUID,
  lobbyId: UUID
) extends Message

object ClientTick {
  implicit val decoder: JsonDecoder[ClientTick] =
    DeriveJsonDecoder.gen[ClientTick]
}

final case class CloseConnection (
  msgType: String,
  clientId: UUID,
  lobbyId: UUID
) extends Message

object CloseConnection {
  implicit val decoder: JsonDecoder[CloseConnection] =
    DeriveJsonDecoder.gen[CloseConnection]
}

final case class ResponseAttackOrderMessage (
  msgType: String,
  soldiers: List[Soldier],
  money: Int,
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

final case class CPUUpdateData (
  msgType: String,
  state: Int, // 5 = playerDefeated // 6 = CPU-units
  money: Int,
  soldiers: List[Soldier],
)
object CPUUpdateData {
  implicit val encoder: JsonEncoder[CPUUpdateData] =
    DeriveJsonEncoder.gen[CPUUpdateData]
  implicit val decoder: JsonDecoder[CPUUpdateData] =
    DeriveJsonDecoder.gen[CPUUpdateData]
}


final case class UpdateData (
  id: UUID,
  playerId: Option[UUID],
  newOwner: Option[UUID],
  updatedPos: Option[Pos],
  state: Option[Int], // 5 = playerDefeated // 6 = CPU-units
  health: Option[Int],
  money: Option[Int],
)

object UpdateData {
  implicit val encoder: JsonEncoder[UpdateData] =
    DeriveJsonEncoder.gen[UpdateData]
  implicit val decoder: JsonDecoder[UpdateData] =
    DeriveJsonDecoder.gen[UpdateData]
}


final case class UpdatedGameDataMessage (
  msgType: String,
  updates: List[UpdateData],
  tick: Int,
)

object UpdatedGameDataMessage {
implicit val encoder: JsonEncoder[UpdatedGameDataMessage] =
  DeriveJsonEncoder.gen[UpdatedGameDataMessage]
}

final case class GameEndMessage (
  msgType: String,
  winner: UUID,
)

object GameEndMessage {
implicit val encoder: JsonEncoder[GameEndMessage] =
  DeriveJsonEncoder.gen[GameEndMessage]
}


final case class AuthenticationMessage (
  username: String,
  password: String,
)

object AuthenticationMessage {
  implicit val encoder: JsonEncoder[AuthenticationMessage] =
    DeriveJsonEncoder.gen[AuthenticationMessage]
  implicit val decoder: JsonDecoder[AuthenticationMessage] =
    DeriveJsonDecoder.gen[AuthenticationMessage]
}