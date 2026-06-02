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
