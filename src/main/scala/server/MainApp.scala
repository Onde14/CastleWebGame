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


  var clientInLobbiesRef = Ref.make(Map.empty[UUID,UUID])
  val clientInLobbiesLayer = ZLayer.fromZIO(clientInLobbiesRef)

  val hubLayer: ZLayer[Any, Nothing, Hub[String]] = ZLayer.fromZIO(Hub.unbounded[String])

  val timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss").withZone(ZoneId.systemDefault())

  /*def createLobby(clientId: UUID): Lobby =
    val id = UUID.randomUUID()
    val gameState = new GameState()
    val clients = ArrayBuffer[UUID](clientId)
    val lobby = new Lobby(id, gameState, clients)
    for {
      _ <- ZIO.service[Ref[Map[UUID, Lobby]]].flatMap(ref => ref.update(_ + (id -> lobby)))
      _ <- ZIO.service[Ref[Map[UUID, UUID]]].flatMap(ref => ref.update(_ + (id -> lobby.id)))
    } yield ()
    return lobby

  def createLobby(clientId: UUID) =
    for {
      gameState <- ZIO.succeed(new GameState())
      clients <- ZIO.succeed(ArrayBuffer[UUID](clientId))
      newLobby <- ZIO.succeed(new Lobby(clientId, gameState, clients))
      _ <- ZIO.service[Ref[Map[UUID, Lobby]]].flatMap(ref => ref.update(_ + (clientId -> newLobby)))
      _ <- ZIO.service[Ref[Map[UUID, UUID]]].flatMap(ref => ref.update(_ + (clientId -> newLobby.id)))
    } yield newLobby

    def lobbyHandle(lobby: Lobby, clientId: UUID) =
      if lobby != null then
        for {
          _ <- addClientInServer(clientId, lobby.id)
          _ <- ZIO.succeed(lobby.addClient(clientId))
        } yield lobby
      else
        for {
          _ <- ZIO.debug("HELLO")
          lobby <- createLobby(clientId)
          _ <- addClientInServer(clientId, lobby.id)
          _ <- ZIO.succeed(lobby.addClient(clientId))
        } yield lobby
*/


  //gameState.changeGameStarted()
  //println("Is game Started: " + gameState.isGameStarted)
  //gameState.buildGameState()
  def addClientInServer(clientId: UUID, lobbyId: UUID) =
    for {
      _ <- ZIO.service[Ref[Map[UUID, UUID]]].flatMap(ref => ref.update(_ + (clientId -> lobbyId)))
    } yield ()

  def fetchLobby(id: UUID) =
    for {
      ref <- ZIO.service[Ref[Map[UUID, Lobby]]]
      lobbies <- ref.get
      _ <- ZIO.succeed(println("Printing lobbies: "))
      _ <- ZIO.succeed(lobbies.foreach((key, lobby) => println(s"Lobby: $key is $lobby")))
      pair <- ZIO.succeed(lobbies.find((key, lobby) => lobby.isFull == false).getOrElse(null))
    } yield pair._2



  val webSocketHandle =
    Handler.webSocket { channel =>
      ZIO.scoped {
        for {
          hub   <- ZIO.service[Hub[String]]
          queue <- hub.subscribe
          lobbiesRef <- ZIO.service[Ref[Set[Lobby]]]
          //lobbies <- lobbiesRef.get
          clientsRef <- ZIO.service[Ref[Map[UUID, UUID]]]
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
                someLobby <- ZIO.succeed(lobbies.find(l => l != null))
               // _ <- ZIO.debug("l: " + someLobby)
                lobby <- ZIO.succeed(someLobby.getOrElse{
                  val newLobby = new Lobby(new GameState, ArrayBuffer[UUID](clientId))
                  newLobby
                })
                lobbyId <- ZIO.succeed(UUID.randomUUID())
                _ <- ZIO.succeed(lobby.id = lobbyId)
                //_ <- ZIO.debug("l: " + lobby)
                _ <- addClientInServer(clientId, lobby.id)
                _ <- ZIO.succeed(lobby.addClient(clientId))
                _ <- lobbiesRef.update(_ + lobby)
                _ <- clientsRef.update(_ + (clientId -> lobbyId))
               // _ <- ZIO.debug(s"LOBBIES: $lobbies")

                clients <- clientsRef.get
                //_ <- ZIO.debug(s"CLIENTS: $clients")

                //lobby <- ZIO.succeed(lobbyHandle(pair._2,newClientId))
                //l <- lobbyHandle(l._2, newClientId)
                //_ <- ZIO.debug("HELLO")
                response <- ZIO.succeed(outgoingMessageHandling("initialClientInfoMessage",List(lobbyId.toString)))
                _ <- channel.send(Read(WebSocketFrame.text(response)))//s"WELCOME ${clientId.toString()}! You are in lobby ${lobby.id.toString()} and isFull = ${lobby.isFull} and started = ${lobby.started}")))
                _ <- ZIO.succeed(lobby.started = true)
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
                _ <- clientsRef.update(_ - clientId)
                clients <- clientsRef.get
                _ <- ZIO.debug(s"CLIENTS: $clients")
              } yield ()
              Console.printLine("Closing channel with status: " + status + " and reason: " + reason)

            case ChannelEvent.Unregistered =>
              for {
                _ <- clientsRef.update(_ - clientId)
                clients <- clientsRef.get
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
    .provide(Server.default, lobbiesLayer, hubLayer, clientInLobbiesLayer)
}
