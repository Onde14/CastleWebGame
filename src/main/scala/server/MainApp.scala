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


case class LobbyRunnables(
  lobbyOutGoings: Set[Fiber.Runtime[Throwable, Unit]] = Set.empty,
  lobbyGameRun: Fiber.Runtime[Nothing, Unit] = null,
)


object MainApp extends ZIOAppDefault {
  val lobbiesRef = Ref.make(Map.empty[Lobby,LobbyRunnables])
  val lobbiesLayer = ZLayer.fromZIO(lobbiesRef)

  val lobbyoutFibersRef = Ref.make(Set.empty[ZIO[Any, Nothing, Fiber.Runtime[Throwable, Unit]]])
  val lobbyoutFibersLayer = ZLayer.fromZIO(lobbyoutFibersRef)


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

  def joinLobby(lobbies: Map[Lobby,LobbyRunnables]) =
    val lobby = lobbies.find((l,_) => {l != null && !l.isFull}).map(_._1)
    lobby

  val webSocketHandle =
    Handler.webSocket { channel =>
      ZIO.scoped {
        for {
          hub   <- ZIO.service[Hub[String]]
          queue <- hub.subscribe
          //lobbyoutRef <- Ref.make(ZIO.unit: ZIO[Any, Throwable, Unit])
          lobbiesRef <- ZIO.service[Ref[Map[Lobby,LobbyRunnables]]]
          clientsInLobbiesRef <- ZIO.service[Ref[Map[UUID, Lobby]]]
          lobbyoutFibersRef <- ZIO.service[Ref[Set[ZIO[Any, Nothing, Fiber.Runtime[Throwable, Unit]]]]]

          outgoing = ZStream
            .fromQueue(queue)
            .map(WebSocketFrame.text)
            .runForeach(frame => channel.send(Read(frame)))

          incoming = channel.receiveAll {

            case Read(WebSocketFrame.Text(text)) =>
              for {
                _ <- ZIO.succeed(println(s"GOT MESSAGE: $text"))
                lobbies <- lobbiesRef.get
                messageEither <- ZIO.succeed(text.fromJson[Message])
                _ <- ZIO.debug(s"MESSAGEEITHER: $messageEither")
                message <- messageEither match
                            case Right(value) =>
                              ZIO.succeed(value)
                            case Left(value) =>
                              ZIO.succeed(null)
                _ <- ZIO.debug(s"MESSAGEHANDLED: $message")
                _ <- ZIO.when(message != null) { message match
                              case attackOrder: RequestAttackOrderMessage =>
                                  for {
                                    clientId = attackOrder.clientId
                                    _ <- ZIO.debug(s"1: $clientId")
                                    lobbyId = attackOrder.lobbyId
                                    _ <- ZIO.debug(s"2: $lobbyId")

                                    lobby = lobbies.find((l,_) => l.id == lobbyId).map(_._1).getOrElse(null)
                                    _ <- ZIO.debug(s"3: $lobby")

                                    selected_castles_ids = attackOrder.selected_castles_ids
                                    _ <- ZIO.debug(s"4: $selected_castles_ids")

                                    target_castle_id = attackOrder.target_castle_id
                                    _ <- ZIO.debug(s"5: $target_castle_id")
                                    _ <- RequestAttackOrderMessageHandling(target_castle_id, selected_castles_ids,clientId, lobby, channel)// ZIO.succeed(lobby.sendAttack(clientId,selected_castles_ids,target_castle_id))


                                  } yield ()
                              case null =>
                                ZIO.succeed(null)
                }
                _ <- ZIO.when(message == null) {
                  channel.send(Read(WebSocketFrame.text("""{"msgType": "InvalidMessage"}""")))//s"WELCOME ${clientId.toString()}! You are in lobby ${lobby.id.toString()} and isFull = ${lobby.isFull} and started = ${lobby.started}")))
                }









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


                lobby <- ZIO.succeed(if someLobby.isDefined then someLobby.get else  createLobby(lobbyHub))
                now <- zio.Clock.ClockLive.instant
                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): lobby = $lobby")
                _ <- clientsInLobbiesRef.update(_ + ((clientId, lobby)))


                _ <- ZIO.succeed(lobby.addClient(clientId))
                clients <- clientsInLobbiesRef.get
                welcome = ClientInfoMessage("ClientInfoMessage", clientId, lobby.id).toJson
                _ <- ZIO.succeed(lobby.gameState.addPlayer(clientId))
                response <- ZIO.succeed(ClientInfoMessage("ClientInfoMessage",clientId,lobby.id).toJson)
                now <- zio.Clock.ClockLive.instant
                _ <- ZIO.debug(s"${now} UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): response = $response")
                _ <- channel.send(Read(WebSocketFrame.text(response)))//s"WELCOME ${clientId.toString()}! You are in lobby ${lobby.id.toString()} and isFull = ${lobby.isFull} and started = ${lobby.started}")))
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
                      runFiber <- lobby.startGame().forkDaemon
                      _ <- ZIO.debug(s"UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete): runFiber = $runFiber")





                    } yield runFiber
                  }
                newLobbyout = ZStream
                  .fromQueue(lobbyQueue)
                  .map(WebSocketFrame.text)
                  .runForeach(frame => {
                  //println(s"FRAME: $frame")
                  channel.send(Read(frame))
                  }).forkDaemon
                _ <- ZIO.debug("lobbyout: " + newLobbyout)
                newLobbyoutFiber <- newLobbyout
                _ <- ZIO.debug("lobbyout: " + newLobbyout)
                lobbiesMap <- lobbiesRef.get
                _ <- ZIO.debug(s"LOBBIESMAP: $lobbiesMap")
                _ <- ZIO.when(lobbiesMap.isEmpty) {
                  for {

                  newRunnables = new LobbyRunnables(Set(newLobbyoutFiber),runFiber.getOrElse(null))

                  _ <- lobbiesRef.set(Map(lobby -> newRunnables))
                  } yield ()
                }
                _ <- ZIO.when(lobbiesMap.nonEmpty) {
                  for {
                    hubSet = lobbiesMap.get(lobby).get.lobbyOutGoings incl newLobbyoutFiber
                    newRunnables = new LobbyRunnables(hubSet,runFiber.get)
                    newLobbiesMap = lobbiesMap.updated(lobby,newRunnables)
                    _ <- lobbiesRef.set(newLobbiesMap)

                  } yield ()
                }
                lobbiesMap <- lobbiesRef.get
                _ <- ZIO.debug(s"LOBBIESMAP: $lobbiesMap")



               // _ <- lobbyoutRef.set(newLobbyout)
                 // _ <- lobbyout
                 // _ <- ZIO.debug(8)
              } yield ()




            case Read(WebSocketFrame.Close(status, reason)) =>
             /* for {

                clientsInLobbies <- clientsInLobbiesRef.get
                lobby <- ZIO.succeed(clientsInLobbies.get(clientId).getOrElse(null))
                _ <- ZIO.when(lobby != null) {
                    for {
                      _ <- ZIO.debug(s"FOUND LOBBY: $lobby")
                      _ <- ZIO.debug(s"DELETING CLIENT: $clientId")
                      _ <- ZIO.succeed(lobby.removeClient(clientId))
                      _ <- clientsInLobbiesRef.update(_ - clientId)
                    } yield ()
                }
                _ <- ZIO.when(lobby.ended){
                      for {
                        _ <- ZIO.debug(s"DESTROYING LOBBY: $lobby")
                        _ <- lobbiesRef.update(_ - lobby)
                        _ <- ZIO.foreach(lobby.clients) { clientId =>
                              ZIO.succeed(println(s"DELETING CLIENT: $clientId"))
                              clientsInLobbiesRef.update(_ - clientId)
                            }
                      } yield()
                }



                clients <- clientsInLobbiesRef.get
                lobbies <- lobbiesRef.get
                _ <- ZIO.debug(s"CLIENTS: $clients")
                _ <- ZIO.debug(s"LOBBIES: $lobbies")

                _ <- ZIO.debug("Closing channel with status: " + status + " and reason: " + reason)

              } yield ()*/
              Console.readLine("Closing channel with status: " + status + " and reason: " + reason)

            case ChannelEvent.Unregistered =>
              /*for {

                clientsInLobbies <- clientsInLobbiesRef.get
                lobby <- ZIO.succeed(clientsInLobbies.get(clientId).getOrElse(null))
                _ <- ZIO.when(lobby != null) {
                    for {
                      _ <- ZIO.debug(s"FOUND LOBBY: $lobby")
                      _ <- ZIO.debug(s"DELETING CLIENT: $clientId")
                      _ <- ZIO.succeed(lobby.removeClient(clientId))
                      _ <- clientsInLobbiesRef.update(_ - clientId)
                    } yield ()
                }
                _ <- ZIO.when(lobby.ended){
                      for {
                        _ <- ZIO.debug(s"DESTROYING LOBBY: $lobby")
                        _ <- lobbiesRef.update(_ - lobby)
                        _ <- ZIO.foreach(lobby.clients) { clientId =>
                               ZIO.succeed(println(s"DELETING CLIENT: $clientId"))
                               clientsInLobbiesRef.update(_ - clientId)
                             }
                      } yield()
                }



                clients <- clientsInLobbiesRef.get
                lobbies <- lobbiesRef.get
                _ <- ZIO.debug(s"CLIENTS: $clients")
                _ <- ZIO.debug(s"LOBBIES: $lobbies")

                _ <- ZIO.debug("Client disconnected")

              } yield () */
              Console.readLine("CHANNEL: "+ channel + ", " + ChannelEvent.Unregistered)


            case _ =>
              ZIO.unit
          }
         // lobbyout <- lobbyoutRef.get
          //_ <- ZIO.debug("PARS: "+ Set(outgoing,incoming,lobbyout))

          //_ <- ZIO.collectAllPar(Set(outgoing,incoming,lobbyout))
            _ <- ZIO.debug("outgoing: " + outgoing)
           lobbies <- lobbiesRef.get
           _ <- ZIO.debug(s"LOBBIES AMOUNT: ${lobbies.size}")
           _ <- outgoing zipPar incoming
           _ <- ZIO.debug("outgoing: " + outgoing)
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
          canvas(id("canvas"), width(GameConfig.width), height(GameConfig.height)),
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

  val routes =
    Routes(
      wsRoute,
      healthRoute,
      htmlRoute
    ) @@
    Middleware.serveResources(path = Path.empty / "scripts" / "dist", resourcePrefix = "scripts/dist") @@
    Middleware.serveResources(path = Path.empty / "scripts" , resourcePrefix = "scripts") @@
    Middleware.serveResources(path = Path.empty / "styles", resourcePrefix = "styles") @@
    Middleware.debug



  override def run =
    Server.serve(routes)
    .provide(Server.default, lobbiesLayer, clientsInLobbiesLayer, lobbyoutFibersLayer, hubLayer)
}