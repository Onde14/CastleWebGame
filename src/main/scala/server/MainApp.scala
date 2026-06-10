package server

import zio._
import zio.http._
import zio.stream._
import zio.http.template2._
import zio.http.ChannelEvent.{ExceptionCaught, Read, UserEvent, UserEventTriggered}
import server.*
import java.util.UUID
import zio.json.ast.Json
import java.time.format.DateTimeFormatter
import java.time.ZoneId
import zio.json.*
import zio.Exit
import scala.collection.mutable.ArrayBuffer
import zio.Clock.ClockLive

object MainApp extends ZIOAppDefault {


  val lobbiesRef = Ref.make(Set.empty[Lobby])
  val lobbiesLayer = ZLayer.fromZIO(lobbiesRef)

  val clientStatusRef = Ref.make(Map.empty[UUID,Boolean])
  val clientStatusLayer = ZLayer.fromZIO(clientStatusRef)

  val clientsInLobbiesRef = Ref.make(Map.empty[UUID,Lobby])
  val clientsInLobbiesLayer = ZLayer.fromZIO(clientsInLobbiesRef)

  val hubLayer: ZLayer[Any, Nothing, Hub[String]] = ZLayer.fromZIO(Hub.unbounded[String])

  val nowMillis =
    ClockLive.instant

  def createLobby(hub: Hub[String]): Lobby =
    val lobbyId = UUID.randomUUID()
    val clientId = UUID.randomUUID()
    val lobby: Lobby = new Lobby(hub, new GameState())
    lobby

  def joinLobby(lobbies: Set[Lobby]) =
    //val lobby = lobbies.find((l,_) => {l != null && !l.isFull}).map(_._1)
    val lobby = lobbies.find((l) => {l != null && !l.isFull && !l.running})
    lobby

  val webSocketHandle =
    Handler.webSocket { channel =>
      ZIO.scoped {
        for {
          lobbyPromise <- Promise.make[Nothing, Lobby]
          queueRef <- Ref.make[Dequeue[String]](null)
          lobbiesRef <- ZIO.service[Ref[Set[Lobby]]]
          clientsInLobbiesRef <- ZIO.service[Ref[Map[UUID, Lobby]]]
          clientStatusRef <- ZIO.service[Ref[Map[UUID, Boolean]]]


          incoming = channel.receiveAll {
            case Read(WebSocketFrame.Text(text)) =>
              for {
               // _ <- ZIO.succeed(println(s"GOT MESSAGE: $text"))
                lobbies <- lobbiesRef.get
                messageEither <- ZIO.succeed(text.fromJson[Message])
               // _ <- ZIO.debug(s"MESSAGEEITHER: $messageEither")
                message <- messageEither match
                            case Right(value) =>
                              ZIO.succeed(value)
                            case Left(value) =>
                              ZIO.succeed(null)
              //  _ <- ZIO.debug(s"MESSAGEHANDLED: $message")
                _ <- ZIO.when(message != null) { message match
                              case attackOrder: RequestAttackOrderMessage =>
                                  for {

                                    clientId = attackOrder.clientId
                                    _ <- ZIO.debug(s"1: $clientId")
                                    lobbyId = attackOrder.lobbyId
                                    _ <- ZIO.debug(s"2: $lobbyId")

                                    //lobby = lobbies.find((l,_) => l.id == lobbyId).map(_._1).getOrElse(null)
                                    lobby = lobbies.find((l) => l.id == lobbyId).getOrElse(null)
                                    //lobbyQueue <- lobby.hub.subscribe
                                    //_ <- queueRef.set(lobbyQueue)
                                    _ <- ZIO.debug(s"3: $lobby")


                                    selected_castles_ids = attackOrder.selected_castles_ids
                                    _ <- ZIO.debug(s"4: $selected_castles_ids")

                                    target_castle_id = attackOrder.target_castle_id
                                    _ <- ZIO.debug(s"5: $target_castle_id")
                                    response <- ZIO.succeed(lobby.gameState.createSoldiers(clientId,target_castle_id,selected_castles_ids))
                                    _ <- ZIO.debug("RequestAttackOrderMessageHandling: " + response)
                                    _ <- ZIO.when(response != null)(lobby.hub.publish(response.toJson))
                                    _ <- ZIO.unit

                                  } yield ()
                              case clientTick: ClientTick =>
                                for {
                                  clientId = clientTick.clientId
                                  //_ <- ZIO.debug(s"Got a Tick from ${clientTick.clientId}")
                                  _ <- clientStatusRef.update(_ + (clientId -> true))
                                  _ <- ZIO.unit
                                } yield ()
                              case closeConnection: CloseConnection =>
                                for {
                                  clientId = closeConnection.clientId
                                  lobbyId = closeConnection.lobbyId
                                  clientsInLobbies <- clientsInLobbiesRef.get
                                  lobby: Lobby = clientsInLobbies.get(clientId).getOrElse(null)
                                  _ <- ZIO.when(lobby != null){
                                    lobby.removeClient(clientId)
                                    if lobby.ended then
                                      println(s"lobbiesRef: $lobbiesRef")
                                      ZIO.succeed(lobbiesRef.update(_ - lobby))
                                      for {
                                        l <- lobbiesRef.get
                                        _ <- ZIO.debug(s"lobbiesRef: $l")
                                      } yield ()
                                    clientsInLobbiesRef.update(_ - clientId)
                                  }
                                  _ <- clientStatusRef.update(_ + (clientId -> true))
                                  _ <- ZIO.unit
                                } yield ()
                              case null =>
                                ZIO.succeed(null)
                }
                _ <- ZIO.when(message == null) {
                  channel.send(Read(WebSocketFrame.text("""{"msgType": "InvalidMessage"}""")))//s"WELCOME ${clientId.toString()}! You are in lobby ${lobby.id.toString()} and isFull = ${lobby.isFull} and started = ${lobby.started}")))
                }
                _ <- lobbyPromise.succeed(null)
              } yield ()

            case UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete) =>
              for {
                now <- zio.Clock.ClockLive.instant
                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): Client connected!")
                clientId <- ZIO.succeed(UUID.randomUUID())
                lobbyHub <- Hub.unbounded[String]
                lobbiesMap <- lobbiesRef.get
                someLobby <- ZIO.succeed(joinLobby(lobbiesMap))
                now <- zio.Clock.ClockLive.instant
                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): someLobby = $someLobby")


                lobby <- ZIO.succeed(if someLobby.isDefined then someLobby.get else createLobby(lobbyHub))
                now <- zio.Clock.ClockLive.instant
                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): lobby = $lobby")
                _ <- clientsInLobbiesRef.update(_ + ((clientId, lobby)))



                _ <- ZIO.succeed(lobby.addClient(clientId))
                _ <- clientStatusRef.update(_ + (clientId -> true))
                _ <- ClientChecker.isClientAlive(clientId, clientStatusRef, clientsInLobbiesRef, lobbiesRef).forkDaemon
                welcome = ClientInfoMessage("ClientInfoMessage", clientId, lobby.id).toJson
                _ <- ZIO.succeed(lobby.gameState.addPlayer(clientId))
                response <- ZIO.succeed(ClientInfoMessage("ClientInfoMessage",clientId,lobby.id).toJson)
                now <- zio.Clock.ClockLive.instant
                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): response = $response")
                _ <- channel.send(Read(WebSocketFrame.text(response)))
                now <- zio.Clock.ClockLive.instant
                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): Lobby is full = ${lobby.isFull}")
                lobbyQueue <- lobby.hub.subscribe




                runFiber <- ZIO.when(lobby.isFull == true) {
                    for {
                      _ <- ZIO.succeed(println(s"${lobby.id} Game Started"))
                      _ <- ZIO.debug(s"LOBBY: ${lobby.id}, CLIENTS: ${lobby.clients}")
                      _ <- ZIO.succeed(lobby.buildGame())
                      response <- ZIO.succeed(BuildGameDataMessage("BuildGameDataMessage",lobby.gameState.mapData).toJson)
                      _ <- lobby.hub.publish(response)
                      runFiber <- lobby.startGame(lobbiesRef).forkDaemon
                      _ <- ZIO.debug(s"UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): runFiber = $runFiber")





                    } yield runFiber
                  }
                _ <- lobbiesRef.update(_ + lobby)
                _ <- queueRef.set(lobbyQueue)
                _ <- lobbyPromise.succeed(lobby)
                lobbiesMap <- lobbiesRef.get
                now <- zio.Clock.ClockLive.instant

                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): LOBBIESMAP: $lobbiesMap")
              } yield ()




            case Read(WebSocketFrame.Close(status, reason)) =>
              println(s"case Read(WebSocketFrame.Close($status, $reason))")
              Console.readLine("Closing channel with status: " + status + " and reason: " + reason)

            case ChannelEvent.Unregistered =>
              println("case ChannelEvent.Unregistered")
              Console.readLine("CHANNEL: "+ channel + ", " + ChannelEvent.Unregistered)


            case _ =>
              println("NONE INCOMING CASE")
              ZIO.unit
          }
          _ <- ZIO.debug(s"webSocketHandle: incoming: ${incoming}")
          _ <- incoming.fork
          lobby <- lobbyPromise.await
         // _ <- ZIO.debug(s"lobby: $lobby")
          queue <- queueRef.get
        //  _ <- ZIO.debug(s"queue: $queue")
         // _ <- ZIO.debug(s"hub size: " + lobby.hub)

          _ <- ZIO.when(queue != null){
            for {
              outgoing = ZStream
                .fromQueue(queue)
                .map(WebSocketFrame.text)
                .runForeach(frame => {
                //println("FRAME: "+frame)
                channel.send(Read(frame))})
              // lobbyout <- lobbyoutRef.get
              //_ <- ZIO.debug("PARS: "+ Set(outgoing,incoming,lobbyout))

              _ <- ZIO.debug("webSocketHandle: outgoing: " + outgoing)
              _ <- outgoing
              _ <- ZIO.debug("webSocketHandle: outgoing: " + outgoing)
              //_ <- ZIO.collectAllPar(Set(outgoing,incoming,lobbyout))
            } yield ()
          }


        } yield ()
      }
    }

  val gamePage: Dom =
    html(
      head(
        title("Castlegame"),
        link(href("styles/styles.css"), rel("stylesheet")),
        //link(relAttr := "stylesheet", href := "/assets/styles.css"),

        //script(src("scripts/dist/client.js"),`type`("module")),
        meta(charset("utf-8"))
      ),
      body(
          canvas(id("canvas"), width(GameConfig.Width), height(GameConfig.Height)),
          script.externalModule("scripts/dist/game.js")
      )
    )





  val helloRoute =
    Method.GET / "hello" ->
      handler(Response.text("Hello, World!"))

  val htmlRoute =
    Method.GET / Root -> handler(Response.html(gamePage))

  val wsRoute =
    Method.GET / "ws" -> handler(webSocketHandle.toResponse)

  val healthRoute =
    Method.GET / "health" ->
      handler(Response.text("OK"))


  val responseRef = Ref.make[String]

  /*val loginRoute =
    Method.POST / "login" ->
      handler { (req: Request) => {
      ZIO.scoped{
        for {
          //_ <- ZIO.debug("HOWIAH")
          r = req.body.toString()
          o = r.fromJson[AuthenticationMessage]
          j = o match
                  case Right(v) =>
                    v
                  case Left(v) =>
                    null
          _ <- ZIO.debug(j)
          u = j.username
          p = j.password
          q <- ZIO.scoped{
            for {
              _ <- ZIO.debug(u+p)
              q <- Queries.getAccount(u,p)
              q <- ZIO.when(q == null)(Queries.getUserName(u))
              _ <- ZIO.when(q == null)(Queries.addUser(UserInfo(u,p,0,0)))
            } yield q
          }


         // u <- ZIO.fromOption(Option(j.username))
          //p <- ZIO.fromOption(Option(j.password))
          //_ <- Response.text("THAWD")
        } yield {
          val que = q
          println(que)
          if que != null then
            Response.text(que.toString())
          else
            Response.text("ERROR")
        }
      }
        //var query: Option[List[UserInfo]] = null
        //val r = ZIO.success(req.body.asString)
        //val j = ZIO.fromEither(r.fromJson[AuthenticationMessage]).orElseFail(new IllegalArgumentException("Invalid JSON"))
        //val u = j.username
        //val p = j.password

          //q <- Queries.getAccount(u,p)
          //q <- ZIO.when(q == null)(Queries.getUserName(u))
          //_ <- ZIO.when(q == null)(Queries.addUser(UserInfo(u,p,0,0)))
        //println("HEELLOOO")
        //Response.text("MOI")
      }
    }*/
      /*handler { (req: Request) =>
        for {
          // 1.  Read the raw request body
          rawBody   <- req.body.asString
          // 2.  Convert the JSON string into LoginRequest
          loginReq  <- ZIO.fromEither(rawBody.fromJson[AuthenticationMessage])
                      .orElseFail(new IllegalArgumentException("Invalid JSON"))
          // 3.  (Optional) Hash the password – here we just use the raw
          //     value because we store it as hash in the DB.
          passwordHash = loginReq.password   // <-- change to real hash in prod
          // 4.  Look up the user
          userOpt   <- Queries.getUser(loginReq.username, passwordHash)
          // 5.  Build the JSON response
          respJson  = userOpt match {
            case Some(u: UserInfo) =>
              Map(
                "user" -> u.username,
              ).toJsonPretty
            case _ =>
              Map("user" -> "Invalid").toJsonPretty
          }
          // 6.  Return a 200 OK with the JSON
          resp = Response.json(respJson)
        } yield resp
      }*/



  val routes =
    Routes(
      wsRoute,
      healthRoute,
      htmlRoute,
      //loginRoute,
    ) @@
    Middleware.serveResources(path = Path.empty / "scripts" / "dist", resourcePrefix = "scripts/dist") @@
    Middleware.serveResources(path = Path.empty / "scripts" , resourcePrefix = "scripts") @@
    Middleware.serveResources(path = Path.empty / "styles", resourcePrefix = "styles") @@
    Middleware.debug



  override def run =
    Server.serve(routes)
    .provide(Server.default, lobbiesLayer, clientsInLobbiesLayer, clientStatusLayer)
}