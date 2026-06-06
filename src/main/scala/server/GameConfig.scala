package server
import scala.collection.mutable.ArrayBuffer
import zio.json._
import java.util.UUID


object Game{
  val width = 1000
  val height = 1000
}
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
  id: UUID,
  color: String,
  castles: ArrayBuffer[Castle],
  units: ArrayBuffer[Soldier],
)

object Player {
  implicit val encoder: JsonEncoder[Player] =
    DeriveJsonEncoder.gen[Player]
}

final case class MapData (
  id: Int,
  pos: Pos,
)

object MapData {
  implicit val decoder: JsonDecoder[MapData] =
    DeriveJsonDecoder.gen[MapData]
}

final case class MapDataFile (
  MapDataFile: List[MapData]
)

object MapDataFile {
  implicit val decoder: JsonDecoder[MapDataFile] =
    DeriveJsonDecoder.gen[MapDataFile]
}


