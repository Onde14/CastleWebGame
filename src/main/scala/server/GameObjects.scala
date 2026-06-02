package server
import scala.collection.mutable.ArrayBuffer
import zio.json._
import scala.compiletime.ops.boolean


sealed trait GameObject



final case class Castle (
  id: Int,
  owner: Int,
  ownerColor: String,
  pos: Pos,
  state: Int, // 0 = dead, 1 = live
) extends GameObject


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
  state: Int, // 0 = dead, 1 = live, 2 = moving
) extends GameObject

final case class SoldierJSON (
  id: String,
  owner: String,
  ownerColor: String,
  pos: Pos,
  target: Pos,
  state: Int, // 0 = dead, 1 = live, 2 = moving
)

object Soldier {
  implicit val encoder: JsonEncoder[Soldier] =
    DeriveJsonEncoder.gen[Soldier]
  implicit val decoder: JsonDecoder[Soldier] =
    DeriveJsonDecoder.gen[Soldier]
}

object GameObject {
  implicit val encoder: JsonEncoder[GameObject] =
    DeriveJsonEncoder.gen[GameObject]
}
