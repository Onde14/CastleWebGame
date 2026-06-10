package server
import io.getquill.jdbczio.Quill
import io.getquill.PostgresZioJdbcContext
import io.getquill._
import scala.compiletime.ops.string
import org.scalafmt.config.Comments.Wrap.no
import zio.json.*
import zio._
import scala.collection.mutable.ArrayBuffer


val database = os.root




//val dataSourceLayer = Quill.DataSource.fromPrefix("database")
//val quillLayer = Quill.Postgres.fromNamingStrategy(SnakeCase)

//val ctx = new SqlMirrorContext(MirrorSqlDialect, Literal)


final case class UserInfo(
  username: String,
  var password: String,
  wins: Int,
  losses: Int,
)

object UserInfo {
  implicit val encoder: JsonEncoder[UserInfo] =
    DeriveJsonEncoder.gen[UserInfo]
  implicit val decoder: JsonDecoder[UserInfo] =
    DeriveJsonDecoder.gen[UserInfo]
}

final case class UserInfoFile(
  data: List[UserInfo]
)

object UserInfoFile {
  implicit val encoder: JsonEncoder[UserInfoFile] =
    DeriveJsonEncoder.gen[UserInfoFile]
  implicit val decoder: JsonDecoder[UserInfoFile] =
    DeriveJsonDecoder.gen[UserInfoFile]
}

final case class Stats(
  username: String,
  wins: Int,
  losses: Int,
)

object Stats {
  implicit val encoder: JsonEncoder[Stats] =
    DeriveJsonEncoder.gen[Stats]
  implicit val decoder: JsonDecoder[Stats] =
    DeriveJsonDecoder.gen[Stats]
}


final case class StatsFile(
  data: List[Stats]
)

object StatsFile {
  implicit val encoder: JsonEncoder[StatsFile] =
    DeriveJsonEncoder.gen[StatsFile]
  implicit val decoder: JsonDecoder[StatsFile] =
    DeriveJsonDecoder.gen[StatsFile]
}






/*object Queries extends PostgresZioJdbcContext(SnakeCase){
  println(database)
  def getAccount(username: String, password: String) =
    run(query[UserInfo].filter(u => u.password == lift(password) && u.username == lift(username)))

  def getUserName(username: String) =
    run(query[UserInfo].filter(_.username == lift(username)))

  def addUser(user: UserInfo) =
    assert(user.username != null && user.password != null && user.wins > -1 && user.losses > -1)
    run(query[UserInfo].insertValue(lift(user)))

  def getStats() =
    for {
      queryList <- run(query[UserInfo])
      //newList: List[UserInfo] = queryList.flatMap(_.password = "").toList
    } yield ()
} */


object DatabaseActions {
  val path = os.pwd/"src"/"main"/"scala"/"server"/"data"/"database.json"


  def getUser(username: String): String =
    val file = os.read(path).fromJson[UserInfoFile].getOrElse(return "")
    val u = file.data.find(_.username == username).getOrElse(return "")
    return u.username

  def addUser(username: String, password: String): String =
    val newAccount = new UserInfo(username,password,0,0)
    os.write.append(path,newAccount.toJson)
    username

  def getStats(): List[Stats] =
    val file = os.read(path).fromJson[UserInfoFile].getOrElse(return null)
    var stats = new ArrayBuffer[Stats]()
    file.data.foreach(u => {
      stats += new Stats(u.username,u.wins,u.losses)
    })
    val newFile = stats.toList
    newFile

}