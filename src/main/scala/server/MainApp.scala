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




object MainApp extends ZIOAppDefault {
  val lobbiesRef = Ref.make(Set.empty[Lobby])
  val lobbiesLayer = ZLayer.fromZIO(lobbiesRef)


  val clientsInLobbiesRef = Ref.make(Map.empty[UUID,Lobby])
  val clientsInLobbiesLayer = ZLayer.fromZIO(clientsInLobbiesRef)

  val hubLayer: ZLayer[Any, Nothing, Hub[String]] = ZLayer.fromZIO(Hub.unbounded[String])

  val timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss").withZone(ZoneId.systemDefault())

  def createLobby(hub: Hub[String]) =
    val lobbyId = UUID.randomUUID()
    val clientId = UUID.randomUUID()
    val lobby: Lobby = new Lobby(hub, new GameState())
    println("LOBBYSDA: " + lobby)
    lobby

  def joinLobby(lobbies: Set[Lobby]) =
    val lobby = lobbies.find(l => l != null && !l.isFull)
    lobby


  val webSocketHandle =
    Handler.webSocket { channel =>
      ZIO.scoped {
        for {
          hub   <- Hub.unbounded[String]
          queue <- hub.subscribe
          lobbiesRef <- ZIO.service[Ref[Set[Lobby]]]
          clientsInLobbiesRef <- ZIO.service[Ref[Map[UUID, Lobby]]]
          clientId <- ZIO.succeed(UUID.randomUUID())


          outgoing = ZStream
            .fromQueue(queue)
            .map(WebSocketFrame.text)
            .runForeach(frame => channel.send(Read(frame)))

          incoming = channel.receiveAll {
            case Read(WebSocketFrame.Text(text)) =>
              println(s"GOT MESSAGE: $text")
              val response = incomingMessageHandling(text)
              if response == "" then
                channel.send(ChannelEvent.Read(WebSocketFrame.text(text)))
              else
                hub.publish(response)

            case UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete) =>
              for {

                lobbyHub <- Hub.unbounded[String]
                _ <- ZIO.debug(s"HUbSDA: $lobbyHub")
                lobbies <- lobbiesRef.get
                someLobby <- ZIO.succeed(joinLobby(lobbies))
                lobby <- ZIO.succeed(someLobby.getOrElse{
                  val newLobby = createLobby(lobbyHub)
                  newLobby
                })
                _ <- clientsInLobbiesRef.update(_ + ((clientId, lobby)))
                _ <- ZIO.succeed(lobby.addClient(clientId))
                _ <- lobbiesRef.update(_ + lobby)
                clients <- clientsInLobbiesRef.get
                welcome = ClientInfoMessage("ClientInfoMessage", clientId, lobby.id).toJson
                response <- ZIO.succeed(ClientInfoMessage("ClientInfoMessage",clientId,lobby.id).toJson)
                _ <- channel.send(Read(WebSocketFrame.text(response)))//s"WELCOME ${clientId.toString()}! You are in lobby ${lobby.id.toString()} and isFull = ${lobby.isFull} and started = ${lobby.started}")))





                _ <- ZIO.debug(s"Lobby is full = ${lobby.isFull}")
                _ <- hub.publish("HEKLLLLLLLLLL")
                lobbyQueue <- lobby.hub.subscribe
                _ <- ZIO.debug(1111111111)
                _ <- ZIO.when(lobby.isFull == true) {
                  //ZIO.scoped {
                    for {
                      //scoped = ZStream.fromHub(lobby.hub)
                      //stream = ZStream.unwrapScoped(scoped)
                      //promise <- Promise.make[Nothing,Unit]
                      _ <- ZIO.debug(1)
                      _ <- ZIO.debug(3)
                      _ <- ZIO.debug(4)
                      _ <- ZIO.debug(3)
                      _ <- ZIO.succeed(println(s"${lobby.id} Game Started"))
                      _ <- ZIO.debug(s"LOBBY: ${lobby.id}, CLIENTS: ${lobby.clients}")
                      _ <- ZIO.succeed(lobby.buildGame())



                      _ <- ZIO.debug(4)

                      response <- ZIO.succeed(BuildGameDataMessage("BuildGameDataMessage",lobby.gameState.mapData).toJson)
                      _ <- ZIO.debug(5)
                      _ <- lobby.hub.publish(response)
                      _ <- ZIO.debug(6)


                    } yield ()
                  }
                  lobbyout = ZStream
                    .fromQueue(lobbyQueue)
                    .map(WebSocketFrame.text)
                    .runForeach(frame => {
                    println(s"FRAME: $frame")
                    channel.send(Read(frame))
                    })
                  _ <- ZIO.debug(7)
                  _ <- lobbyout
                  _ <- ZIO.debug(8)
                //}
              } yield ()




            case Read(WebSocketFrame.Close(status, reason)) =>
              for {

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

              } yield ()

            case ChannelEvent.Unregistered =>
              for {

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

              } yield ()


            case _ =>
              ZIO.unit
          }
          _ <- outgoing zipPar incoming
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
          canvas(id("canvas"), width(1000), height(1000)),
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
    .provide(Server.default, lobbiesLayer, clientsInLobbiesLayer)
}
