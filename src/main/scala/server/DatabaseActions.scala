package server
import io.getquill.jdbczio.Quill
import io.getquill.PostgresZioJdbcContext
import io.getquill._
import scala.compiletime.ops.string
import org.scalafmt.config.Comments.Wrap.no

val database = os.root




val dataSourceLayer = Quill.DataSource.fromPrefix("database")
val quillLayer = Quill.Postgres.fromNamingStrategy(SnakeCase)

val ctx = new SqlMirrorContext(MirrorSqlDialect, Literal)


final case class UserInfo(
  username: String,
  var password: String,
  wins: Int,
  losses: Int,
)

object Queries extends PostgresZioJdbcContext(SnakeCase){
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
}