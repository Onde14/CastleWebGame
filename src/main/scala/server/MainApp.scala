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

  def createLobby() =
    var hub: Hub[String] = null
    for {
      h <- Hub.unbounded[String]
    } yield hub = h
    val lobbyId = UUID.randomUUID()
    val clientId = UUID.randomUUID()
    val lobby: Lobby = new Lobby(hub, new GameState())
    lobby

  def joinLobby(lobbies: Set[Lobby]) =
    val lobby = lobbies.find(l => l != null)
    lobby


  val webSocketHandle =
    Handler.webSocket { channel =>
      ZIO.scoped {
        for {
          hub   <- ZIO.service[Hub[String]]
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
              //hub.publish(response)

            case UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete) =>

              val event = ChannelEvent
              //val clientId = UUID.randomUUID()
              println(event)
              for {
                //_ <- ZIO.succeed(println("HELLOPRINT"))
              //  _ <- ZIO.debug("HELLO")

                lobbies <- lobbiesRef.get
              //  _ <- ZIO.debug(s"LOBBIES: $lobbies")

                //newClientId <- ZIO.succeed(UUID.randomUUID())
                someLobby <- ZIO.succeed(joinLobby(lobbies))
               // _ <- ZIO.debug("l: " + someLobby)
                lobby <- ZIO.succeed(someLobby.getOrElse{
                  val newLobby = createLobby()
                  newLobby
                })
                //_ <- ZIO.debug("l: " + lobby)
                _ <- clientsInLobbiesRef.update(_ + ((clientId, lobby)))
                _ <- ZIO.succeed(lobby.addClient(clientId))
                _ <- lobbiesRef.update(_ + lobby)
               // _ <- ZIO.debug(s"LOBBIES: $lobbies")

                clients <- clientsInLobbiesRef.get
                //_ <- ZIO.debug(s"CLIENTS: $clients")

                //lobby <- ZIO.succeed(lobbyHandle(pair._2,newClientId))
                //l <- lobbyHandle(l._2, newClientId)
                //_ <- ZIO.debug("HELLO")
                response <- ZIO.succeed(outgoingMessageHandling("initialClientInfoMessage",List(clientId.toString,lobby.id.toString)))
                _ <- channel.send(Read(WebSocketFrame.text(response)))//s"WELCOME ${clientId.toString()}! You are in lobby ${lobby.id.toString()} and isFull = ${lobby.isFull} and started = ${lobby.started}")))

                _ <- ZIO.when(lobby.isFull == true)(
                      ZIO.succeed(println(s"$lobby.id Game Started"),
                      lobby.buildGame())
                    )
                //_ <- ZIO.attempt(channel.send(Read(WebSocketFrame.text(r))

                //_ <- ZIO.interrupt
              } yield ()
              //channel.send(Read(WebSocketFrame.text(s"WELCOME ${newClientId.toString()}! You are in lobby ${lobby.id.toString()} and isFull = ${lobby.isFull}")))
              //val player = gameState.addPlayer()
              //println(s"WebSocket connection established to ${player.id} with color ${player.color}!")
              //val player_data_response_json = s"""{"type": "PlayerData","id": ${player.id},"color": "${player.color}"}"""
              //val player_data_response_json = BuildGameDataMessage("BuildGame",player.id,player.color,gameState.availablePlayerSlots).toJson
              //channel.send(Read(WebSocketFrame.text(player_data_response_json)))





            case Read(WebSocketFrame.Close(status, reason)) =>
              for {
                _ <- clientsInLobbiesRef.update(_ - clientId)
                clients <- clientsInLobbiesRef.get
                _ <- ZIO.debug(s"CLIENTS: $clients")
              } yield ()
              Console.printLine("Closing channel with status: " + status + " and reason: " + reason)

            case ChannelEvent.Unregistered =>
              for {
                _ <- clientsInLobbiesRef.update(_ - clientId)
                clients <- clientsInLobbiesRef.get
                _ <- ZIO.debug(s"CLIENTS: $clients")

                _ <- ZIO.logInfo("Client disconnected")
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
    .provide(Server.default, lobbiesLayer, hubLayer, clientsInLobbiesLayer)
}
