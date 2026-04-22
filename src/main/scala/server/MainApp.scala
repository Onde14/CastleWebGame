package server

import zio._
import zio.http._
import zio.http.template2._
import zio.http.ChannelEvent.{ExceptionCaught, Read, UserEvent, UserEventTriggered}
import server.GameState

object MainApp extends ZIOAppDefault {

  val gameState: GameState = GameState()
  gameState.changeGameStarted()
  println("Is game Started: " + gameState.isGameStarted)
  gameState.buildGameState()

  val socketApp: WebSocketApp[Any] =
    Handler.webSocket { channel =>
      channel.receiveAll {
        case Read(WebSocketFrame.Text(text)) =>
          // Echo the message back or process it
          ZIO.logInfo("ATTACK")
          gameState.testOrdersAdd()
          channel.send(Read(WebSocketFrame.Text(s"Server received: $text, ${gameState.testGetOrders()}")))

        case UserEventTriggered(ChannelEvent.UserEvent.HandshakeComplete) =>
          gameState.testOrdersReset()
          ZIO.logInfo("WebSocket connection established!")

        case _ =>
          ZIO.unit
      }
    }

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
          canvas(id("canvas"), width("500"), height("500")),
          script.externalModule("scripts/dist/game.js")
      )
    )


  val helloRoute =
    Method.GET / "hello" ->
      handler(Response.text("Hello, World!"))

  val htmlRoute =
    Method.GET / Root -> handler{(req: Request) =>
      Response.html(gamePage)}

  val socketResponseRoute =
      Method.GET / "ws" -> handler(socketApp.toResponse)

  val app =
    Routes(helloRoute,htmlRoute,socketResponseRoute) @@
    Middleware.serveResources(path = Path.empty / "scripts" / "dist", resourcePrefix = "scripts/dist") @@
    Middleware.serveResources(path = Path.empty / "scripts" , resourcePrefix = "scripts") @@
    Middleware.serveResources(path = Path.empty / "styles", resourcePrefix = "styles") @@
    Middleware.debug

  override def run =
    val cl = getClass.getClassLoader
    val url = cl.getResource("scripts/dist")
    val url2 = cl.getResource("scripts/dist/client.js")


    Console.printLine(s"static folder found at: $url") *>
    //val testpath = Root / "scripts"
    //println("ROOT STRINGIKSI: " + script.inlineResource("scripts/dist/client.js"))
    Server.serve(app).provide(Server.default)
}
