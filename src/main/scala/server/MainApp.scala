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



object MainApp extends ZIOAppDefault {




  val hubLayer: ZLayer[Any, Nothing, Hub[String]] = ZLayer.fromZIO(Hub.unbounded[String])

  val timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss").withZone(ZoneId.systemDefault())


  val gameState: GameState = GameState()
  val gameStateRef = Ref.make(gameState)
  val game: Game = Game(gameState)
  game.gameRunning = true
  //def gameLoop = game.runGame()

  gameState.changeGameStarted()
  println("Is game Started: " + gameState.isGameStarted)
  gameState.buildGameState()


  val webSocketHandle: WebSocketApp[Hub[String]] =
    Handler.webSocket { channel =>
      ZIO.scoped {
        for {
          hub   <- ZIO.service[Hub[String]]
          queue <- hub.subscribe

          outgoing = ZStream
            .fromQueue(queue)
            .map(WebSocketFrame.text)
            .runForeach(frame => channel.send(Read(frame)))

          incoming = channel.receiveAll {
            case Read(WebSocketFrame.Text(text)) =>
              println(s"GOT MESSAGE: $text")
              val response = messageHandling(text,gameState)
              if response == "" then
                var timeStamp = ""
                for {
                  now       <- Clock.instant // ⏱️ Safely fetch current time via ZIO Clock
                  timeStamp = timeFormatter.format(now)
                } yield timeStamp
                val errorResponse = s"""{"msgType":"Message","time":"${timeStamp}","message":"${text}"}"""
                channel.send(ChannelEvent.Read(WebSocketFrame.text(errorResponse)))
              else
                hub.publish(response)
              //hub.publish(response)

            case UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete) =>
              gameState.testOrdersReset()
              val player = gameState.addPlayer()
              println(s"WebSocket connection established to ${player.id} with color ${player.color}!")
              //val player_data_response_json = s"""{"type": "PlayerData","id": ${player.id},"color": "${player.color}"}"""
              val player_data_response_json = GameData("BuildGame",player.id,gameState.getPlayers()).toJson
              channel.send(Read(WebSocketFrame.text(player_data_response_json)))



            case Read(WebSocketFrame.Close(status, reason)) =>
              Console.printLine("Closing channel with status: " + status + " and reason: " + reason)

            case ChannelEvent.Unregistered =>
              ZIO.logInfo("Client disconnected")


            case _ =>
              ZIO.unit
          }
          _ <- outgoing zipPar incoming
          // Run both concurrently. When this ends, ZIO.scoped closes and unsubscribes the queue.

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
          canvas(id("canvas"), width(gameState.getGameWidth()), height(gameState.getGameHeight())),
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

  def gameLoop =
    ZIO.scoped{
      for {
        hub <- ZIO.service[Hub[String]]
        _   <- hub.publish("tick")
        //_ <- ZIO.logInfo(s"Publishing 'tick'")
        _   <- ZIO.sleep(16.millis)             // ~60 FPS
      } yield ()
    }



  override def run =
    Server.serve(routes)
      .zipPar(
        gameLoop
          .forever
      ).provide(hubLayer, Server.default).unit
}
