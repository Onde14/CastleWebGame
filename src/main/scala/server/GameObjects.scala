package server
import scala.collection.mutable.ArrayBuffer
import zio.json._
import scala.compiletime.ops.boolean






final case class Castle (
  id: Int,
  owner: Int,
  ownerColor: String,
  pos: Pos,
)


object Castle {
  implicit val encoder: JsonEncoder[Castle] =
    DeriveJsonEncoder.gen[Castle]
  implicit val decoder: JsonDecoder[Castle] =
    DeriveJsonDecoder.gen[Castle]
}

final case class Soldier (
  id: Int,
  owner: Int,
  ownerColor: String,
  pos: Pos,
  target: Pos,
)

object Soldier {
  implicit val encoder: JsonEncoder[Soldier] =
    DeriveJsonEncoder.gen[Soldier]
  implicit val decoder: JsonDecoder[Soldier] =
    DeriveJsonDecoder.gen[Soldier]
}
