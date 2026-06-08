package server
import scala.collection.mutable.ArrayBuffer
import zio.json._
import scala.compiletime.ops.boolean
import java.util.UUID
import server.*



sealed trait GameObject



final case class Castle (
  id: UUID,
  var owner: UUID,
  var ownerColor: String,
  pos: Pos,
  var state: Int = 1, // 0 = dead, 1 = live, 3 = captured
  var health: Int = GameConfig.CastleHealth,
  var villages: List[Village]
) extends GameObject

object Castle {
  implicit val encoder: JsonEncoder[Castle] =
    DeriveJsonEncoder.gen[Castle]
  implicit val decoder: JsonDecoder[Castle] =
    DeriveJsonDecoder.gen[Castle]
}

final case class Village (
  id: UUID,
  var owner: UUID,
  pos: Pos,
  var state: Int = 1, // 0 = dead, 1 = live
  var health: Int = GameConfig.VillageHealth,
) extends GameObject


object Village {
  implicit val encoder: JsonEncoder[Village] =
    DeriveJsonEncoder.gen[Village]
  implicit val decoder: JsonDecoder[Village] =
    DeriveJsonDecoder.gen[Village]
}

final case class Soldier (
  id: UUID,
  owner: UUID,
  ownerColor: String,
  pos: Pos,
  target: Pos,
  targetCastleId: UUID,
  var state: Int = 1, // 0 = dead, 1 = live, 2 = moving,
  var health: Int = GameConfig.SoldierHealth,
  damage: Int = 10,
) extends GameObject


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
