package server

import zio._
import zio.http._
import zio.http.template2._
import zio.http.ChannelEvent.{ExceptionCaught, Read, UserEvent, UserEventTriggered}
import server.*
import java.util.UUID
import zio.json.ast.Json
import java.time.format.DateTimeFormatter
import java.time.ZoneId







object MainApp extends ZIOAppDefault {

  val gameState: GameState = GameState()
  gameState.changeGameStarted()
  println("Is game Started: " + gameState.isGameStarted)
  gameState.buildGameState()

  val hubLayer: ZLayer[Any, Nothing, Hub[String]] = ZLayer.fromZIO(Hub.unbounded[String])

  val timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss").withZone(ZoneId.systemDefault())

  import zio._
  import zio.http._
  import zio.stream._



  val webSocketHandle: WebSocketApp[Hub[String]] =
    Handler.webSocket { channel =>
      ZIO.scoped { // 💡 Creates a local scope for the lifetime of this connection
        for {
          hub   <- ZIO.service[Hub[String]]
          queue <- hub.subscribe // ✅ Scope is now available locally!

          // Outgoing: Hub -> client
          outgoing = ZStream
            .fromQueue(queue)
            .map(WebSocketFrame.text)
            .runForeach(frame => channel.send(Read(frame)))

          // Incoming: client -> Hub
          incoming = channel.receiveAll {
            case Read(WebSocketFrame.Text(text)) =>
              //val timeNow = Clock.instant
              //val timeStamp = timeFormatter.format(timeNow)
              //val response = "\n" + text
              //hub.publish(response).unit
              for {
                now       <- Clock.instant // ⏱️ Safely fetch current time via ZIO Clock
                timestamp = timeFormatter.format(now)
                _         <- hub.publish(s"[$timestamp] $text")
              } yield ()
            case _ =>
              ZIO.unit
          }

          // Run both concurrently. When this ends, ZIO.scoped closes and unsubscribes the queue.
          _ <- outgoing zipPar incoming
        } yield ()
      }
    }


  /*

  val socketApp: ZIO[Hub[String], Nothing, WebSocketApp[Any]] =
    ZIO.service[Hub[String]].map { hub =>
      Handler.webSocket { channel =>
        ZIO.scoped {
          for {

            queue <- hub.subscribe

            sendFiber <- queue.take
              .map(WebSocketFrame.text)
              .forever(frame => channel.send(Read(frame)).ignore)
              .fork

            _ <- channel.receiveAll {
              case Read(WebSocketFrame.Text(text)) =>
                // Echo the message back or process it
                println("ATTACK")
                gameState.testOrdersAdd()
                val response_json = s"""{"type": "AttackOrder", "message": "$text, ${gameState.testGetOrders()}"}"""
                hub.publish(response_json)
                channel.send(Read(WebSocketFrame.text(response_json)))

              case UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete) =>
                gameState.testOrdersReset()
                val player = gameState.addPlayer()
                println(s"WebSocket connection established to ${player.id} with color ${player.color}!")
                val response_json = s"""{"type": "PlayerData","id": ${player.id},"color": "${player.color}"}"""
                hub.publish("Player joined!")
                channel.send(Read(WebSocketFrame.text(response_json)))

              case Read(WebSocketFrame.Close(status, reason)) =>
                Console.printLine("Closing channel with status: " + status + " and reason: " + reason)

              case ChannelEvent.Unregistered =>
                sendFiber.interrupt *>
                ZIO.logInfo("Client disconnected")

              case ExceptionCaught(cause) =>
                Console.printLine(s"Channel error!: ${cause.getMessage}")

              case _ =>
                ZIO.unit
            }
          } yield ()
        }
      }
    }



  */




  //
  // Application HTML-Layout
  //


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
    Method.GET / Root -> handler{(req: Request) =>
      Response.html(gamePage)}
/*  val routes: ZIO[Hub[String], Nothing, Routes[Any, Response]] =
  socketApp.map { app =>
    Routes(
      Method.GET / "ws" -> handler(app.toResponse)
    )



    val wsRoutes: ZIO[Hub[String], Nothing, Routes[Any, Response]] =
      socketApp.map { socket =>
        Routes (
          Method.GET / "ws" -> handler(socket.toResponse)
        )
      }

      val otherRoutes =
        Routes(helloRoute,htmlRoute) @@
        Middleware.serveResources(path = Path.empty / "scripts" / "dist", resourcePrefix = "scripts/dist") @@
        Middleware.serveResources(path = Path.empty / "scripts" , resourcePrefix = "scripts") @@
        Middleware.serveResources(path = Path.empty / "styles", resourcePrefix = "styles") @@
        Middleware.debug


      val app: ZIO[Hub[String], Nothing, Routes[Any, Response]] =
        wsRoutes.map(ws => otherRoutes ++ ws)



      val app: HttpApp[Hub[String]] =
        Routes(
          Method.GET / "ws" -> handler(socketApp)
        )
  }*/

  val wsRoute: Route[Hub[String], Throwable] =
    Method.GET / "ws" -> handler(webSocketHandle.toResponse)

  val healthRoute: Route[Any, Nothing] =
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










 /*

 override val run =
   val cl = getClass.getClassLoader
   val url = cl.getResource("scripts/dist")
   val url2 = cl.getResource("scripts/dist/client.js")



   Console.printLine(s"static folder found at: $url")
   app.flatMap(Server.serve).provide(
     Server.default,
     hubLayer
   )

 */



 def run =
   Server.serve(
     routes.handleError(error =>
       Response.internalServerError(s"An unhandled error occurred: ${error.getMessage}")
     )
   )
   .provide(
     Server.default,
     hubLayer
   )


    //val testpath = Root / "scripts"
    //println("ROOT STRINGIKSI: " + script.inlineResource("scripts/dist/client.js"))
    //

    //Server.serve(routes).provide(Server.default, hubLayer)
}
