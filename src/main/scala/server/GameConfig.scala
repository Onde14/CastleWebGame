package server
import scala.collection.mutable.ArrayBuffer

case class Castle (
  id: Int | Null,
  owner: Int | Null,
  location: List[Int],
)

case class Troop (
  id: Int | Null,
  owner: Int | Null,
  location: List[Int],
  target: List[Int],
)

case class Player (
  id: Int,
  color: String,
  castles: ArrayBuffer[Castle],
  units: ArrayBuffer[Unit],
)
