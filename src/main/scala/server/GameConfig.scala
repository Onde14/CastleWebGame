package server
import scala.collection.mutable.ArrayBuffer
import zio.json._

case class Pos(
  var x: Double,
  var y: Double,
)


object Pos {
  implicit val encoder: JsonEncoder[Pos] =
    DeriveJsonEncoder.gen[Pos]
  implicit val decoder: JsonDecoder[Pos] =
    DeriveJsonDecoder.gen[Pos]
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


final case class BuildGameData (
  msgType: String,
  your_id: Int,
  players: ArrayBuffer[Player],
)

object BuildGameData {
implicit val encoder: JsonEncoder[BuildGameData] =
  DeriveJsonEncoder.gen[BuildGameData]
}

final case class UpdatedGameData (
  msgType: String,
  players: ArrayBuffer[Player],
)

object UpdatedGameData {
implicit val encoder: JsonEncoder[UpdatedGameData] =
  DeriveJsonEncoder.gen[UpdatedGameData]
}
