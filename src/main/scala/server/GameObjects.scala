package server
import scala.collection.mutable.ArrayBuffer
import zio.json._

final case class Pos(
  x: Int,
  y: Int,
)

object Pos {
  implicit val encoder: JsonEncoder[Pos] =
    DeriveJsonEncoder.gen[Pos]
  implicit val decoder: JsonDecoder[Pos] =
    DeriveJsonDecoder.gen[Pos]
}


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

final case class Player (
  id: Int,
  color: String,
  castles: ArrayBuffer[Castle],
  units: ArrayBuffer[Soldier],
)

object Player {
  implicit val encoder: JsonEncoder[Player] =
    DeriveJsonEncoder.gen[Player]
}


final case class GameData (
  msgType: String,
  your_id: Int,
  players: ArrayBuffer[Player],
)

object GameData {
implicit val encoder: JsonEncoder[GameData] =
  DeriveJsonEncoder.gen[GameData]
}
