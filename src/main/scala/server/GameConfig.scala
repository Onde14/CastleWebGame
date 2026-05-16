package server
import scala.collection.mutable.ArrayBuffer
import zio.json._

case class Castle (
  id: Int,
  owner: Int,
  ownerColor: String,
  location: List[Int],
)


object Castle {
implicit val encoder: JsonEncoder[Castle] =
  DeriveJsonEncoder.gen[Castle]
}

case class Troop (
  id: Int,
  owner: Int,
  ownerColor: String,
  location: List[Int],
  target: List[Int],
)

object Troop {
implicit val encoder: JsonEncoder[Troop] =
  DeriveJsonEncoder.gen[Troop]
}

case class Player (
  id: Int,
  color: String,
  castles: ArrayBuffer[Castle],
  units: ArrayBuffer[Troop],
)

object Player {
implicit val encoder: JsonEncoder[Player] =
  DeriveJsonEncoder.gen[Player]
}


case class GameData (
  msgType: String,
  your_id: Int,
  players: ArrayBuffer[Player],
)

object GameData {
implicit val encoder: JsonEncoder[GameData] =
  DeriveJsonEncoder.gen[GameData]
}
