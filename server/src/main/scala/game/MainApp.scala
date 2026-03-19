package game

import zio._
import zio.http._
import zio.http.endpoint._
import zio.http.html.{html => html5, _}

object MainApp extends ZIOAppDefault {



  //
  // Application HTML-Layout 
  //

  def withContentHtml(contentTitle:zio.http.html.Html)(content: zio.http.html.Html) = 
    html5(
      head(
        title("Castlegame"), 
        link(relAttr := "stylesheet", href := "/assets/styles.css"), 
        meta(charsetAttr := "utf-8")
      ), 
      body(
        header(
          a(href := "/", img(srcAttr := "/assets/zio.png")),
        ),
        zio.http.html.main(
          div(
            contentTitle,
            content,
          )
        )
      )
    ) 



  //
  // Web Assets
  //

  def makeWebAssets: Http[Any, Throwable, Request, Response] = 
    Http.collectHttp[Request] {
      case Method.GET -> !! / "assets" / asset =>
        Http.fromResource(asset)
    }



  //
  // Web Application
  //

  def makeWebApp:App[Any] = 
    Http.collect[Request] {

      case Method.GET -> !! => 
        Response.html(
          withContentHtml(h2(styleAttr := List("border" -> "none"), "You're running on ZIO Http!")) {
            div(
              h1("Game"), 
              p("Lets start gaming"),
              canvas(id := "canvas", width := "500", height := "500"), 
              script(src := "client.js"),
            )           
          }
        )
    }


  //
  // Web API
  //

  def makeWebAPI:App[Any] = {
    import zio.http.codec.HttpCodec._
    Endpoint
      .get("api" / "users" / int("userId"))
      .query(queryBool("show-details"))
      .out[String]
      .implement { 
        case (userId, showDetails) => 
          ZIO.succeed("user " + userId + " with details? " + showDetails)
      }.toApp
  }



  //
  // Render a Http Not Found
  //

  def makeNotFound = 
    Http.collect[Request] {
      case req => 
        Response.html(
          withContentHtml(h2("""Customized <br />Http Not Found"""))(
            div(
              div(
                p(s"""Sorry, your requested page "${req.path.encode}" does not exist."""), 
                p("This is a customized page for any non-existing endpoints in your application"),
                a(href := "/and-another-not-found", "Try one more")
              )
            )
          ), 
          Status.NotFound
        )
    }



  //
  // Compose your separate http apps to a larger http app 
  //

  val routes = (
    makeWebApp    ++ 
    makeWebAPI    ++ 
    makeWebAssets ++ 
    makeNotFound
  )
    .catchAllCauseZIO(_ => ZIO.succeed(
        Response.html(
          withContentHtml(h2("""Customized <br />Http Internal Server Error"""))(
            div(
              div(
                p("Sorry, we did not expect this failure."), 
                p("This is a customized page for any errors that may happen unexpectedly"),
              ),           
              a(classAttr := List("next"), href := "/show-not-found", "Next")
            )
          ), 
          Status.InternalServerError
        )
      )
    )



  //
  // Start your server
  //

  override val run = {
    Console.printLine("please visit http://localhost:8080") *> 
    Server.serve(routes).provide(Server.default)
  }
}
