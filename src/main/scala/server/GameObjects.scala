package server
import scala.collection.mutable.ArrayBuffer
import zio.json._
import scala.compiletime.ops.boolean
import java.util.UUID



sealed trait GameObject



final case class Castle (
  id: UUID,
  owner: UUID,
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

final case class Village (
  id: UUID,
  owner: UUID,
  ownerColor: String,
  pos: Pos,
  state: Int, // 0 = dead, 1 = live
)

final case class Soldier (
  id: UUID,
  owner: UUID,
  ownerColor: String,
  pos: Pos,
  target: Pos,
  var state: Int, // 0 = dead, 1 = live, 2 = moving, 3 = attacking
  radius: Int = 10,
  health: Int = 100,
  damage: Int = 10,
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
