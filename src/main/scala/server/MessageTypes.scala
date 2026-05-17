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

final case class RequestAttackOrder (
  msgType: String,
  playerId: Int,
  target_castle: Castle,
  selected_castles: List[Castle],
)

object RequestAttackOrder {
  implicit val encoder: JsonEncoder[RequestAttackOrder] =
    DeriveJsonEncoder.gen[RequestAttackOrder]
  implicit val decoder: JsonDecoder[RequestAttackOrder] =
    DeriveJsonDecoder.gen[RequestAttackOrder]
}

final case class ResponseAttackOrder (
  msgType: String,
  soldiers: List[Soldier],
)

object ResponseAttackOrder {
  implicit val encoder: JsonEncoder[ResponseAttackOrder] =
    DeriveJsonEncoder.gen[ResponseAttackOrder]
  implicit val decoder: JsonDecoder[ResponseAttackOrder] =
    DeriveJsonDecoder.gen[ResponseAttackOrder]
}
