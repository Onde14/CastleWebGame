package server
import scala.collection.mutable.ArrayBuffer


case class Castle (
  id: Int,
  owner: Int,
  location: List[Int],
)

case class Troop (
  id: Int,
  owner: Int,
  location: List[Int],
  target: List[Int],
)

case class Player (
  id: Int,
  castles: ArrayBuffer[Castle],
  units: ArrayBuffer[Unit],
)
