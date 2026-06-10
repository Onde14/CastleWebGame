package server
import java.util.UUID
import zio._
import server.*


import server.MainApp.clientsInLobbiesRef

object ClientChecker {
  def isClientAlive(clientId: UUID, clientStatusRef: Ref[Map[UUID, Boolean]], clientsInLobbiesRef: Ref[Map[UUID,Lobby]], lobbiesRef: Ref[Set[Lobby]]) =
    for {
      _ <- (
        for {
          //_ <- ZIO.debug(s"isClientAlive: Checking on $clientId")
          clientStatus <- clientStatusRef.get
          status = clientStatus.get(clientId).getOrElse(false)
          _ <- ZIO.when(!status){
            for {
              _ <- ZIO.debug(s"isClientAlive: Client $clientId Disconnected.")
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
              _ <- ZIO.interrupt

            } yield ()
          }
          newclientStatus <- clientStatusRef.get
          //_ <- ZIO.debug(s"isClientAlive: Client $clientId is alive")
          //_ <- ZIO.debug(s"isClientAlive: newclientStatus $newclientStatus")
          _ <- clientStatusRef.update(_ + (clientId -> false))
        } yield ()
      ).repeat(Schedule.fixed(5.seconds))
    } yield ()
}