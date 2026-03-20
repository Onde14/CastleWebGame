package game

import zio._
import zio.http._
import zio.http.template2._

object MainApp extends ZIOAppDefault {

  //
  // Application HTML-Layout 
  //


  val gamePage: Dom = 
    html(
      head(
        title("Castlegame"), 
        //link(relAttr := "stylesheet", href := "/assets/styles.css"),
        
        //script(src("scripts/dist/client.js"),`type`("module")),
        meta(charset("utf-8"))
      ), 
      body(
          h1("GAME"),
          p("Game time started"),
          canvas(id("canvas"), width("500"), height("500")),
          script.externalModule("scripts/dist/client.js")
      )
    )

  
 /* val staticRoutes =
    Method.GET / "assets" / trailing -> handler {
      Routes.empty @@ Middleware.serveResources(Path.empty / "assets")
    }
  */

  val helloRoute =
    Method.GET / "hello" -> 
      handler(Response.text("Hello, World!"))

  val htmlRoutes =
    Method.GET / Root -> handler(Response.html(gamePage))

  val staticRoutes =
    Method.GET / "scripts" -> handler(Handler.fromResource("scripts").orElse(Handler.notFound))

  val jsRoute =
    Method.GET / "scripts" / "dist" / "client.js" -> handler(Handler.fromResource("scripts/dist/client.js").orElse(Handler.notFound))

  val jsMapRoute =
    Method.GET / "scripts" / "dist" / "client.js.map" -> handler(Handler.fromResource("scripts/dist/client.js.map").orElse(Handler.notFound))

  val echoRoute =
    Method.POST / "echo" ->
      handler { (req: Request) => req.body.asString(Charsets.Utf8).map(Response.text(_)).orDie }

  val routes = 
    Routes(htmlRoutes,
          staticRoutes,
          jsRoute,
          jsMapRoute,
          helloRoute,
          echoRoute

    ) @@ Middleware.debug


  // Start your server
  // Serving the routes using the default server layer on port 8080
  //
  override def run = 
    val cl = getClass.getClassLoader
    val url = cl.getResource("scripts")
    val url2 = cl.getResource("scripts/dist/client.js")
    
    Console.printLine(s"static folder found at: $url") *>
    Console.printLine(s"client.js found at: $url2") *>
    //val testpath = Root / "scripts"
    //println("ROOT STRINGIKSI: " + script.inlineResource("scripts/dist/client.js"))
    Server.serve(routes).provide(Server.default)
} 
