package server
import scala.collection.mutable.ArrayBuffer
import zio.json._
import java.util.UUID

final case class ConfigFile (
  width: Int,
  height: Int,
  soldierRadius: Int,
  soldierHealth: Int,
  soldierDamage: Int,
  villageSize: Int,
  villageHealth: Int,
  castleSize: Int,
  castleHealth: Int,
  soldierSpeed: Int,
)

object ConfigFile {
  implicit val decoder: JsonDecoder[ConfigFile] =
    DeriveJsonDecoder.gen[ConfigFile]
}

object GameConfig {
  val path = os.pwd/"src"/"main"/"resources"/"scripts"/"GameConfig.json"

  val file = os.read(path).fromJson[ConfigFile]
  val config = file match
    case Right(v) =>
      v
    case Left(v) =>
      println("ERROR: could not load config file")
      null


  val Width = config.width
  val Height = config.height
  val SoldierRadius = config.soldierRadius
  val SoldierHealth = config.soldierHealth
  val SoldierDamage = config.soldierDamage
  val SoldierSpeed = config.soldierSpeed
  val VillageSize = config.villageSize
  val VillageHealth = config.villageHealth
  val CastleSize = config.castleSize
  val CastleHealth = config.castleHealth

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
  var money: Int = 0,
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


