package server
import java.util.UUID
import zio._


import server.MainApp.clientsInLobbiesRef

object ClientChecker {
  def isClientAlive(clientId: UUID, clientStatusRef: Ref[Map[UUID, Boolean]]) =
    for {
      _ <- (
        for {
          _ <- ZIO.debug("isClientAlive: Checking on $clientId")
          clientStatus <- clientStatusRef.get
          status = clientStatus.get(clientId).getOrElse(false)
          _ <- ZIO.when(!status){
            for {
              _ <- ZIO.debug(s"isClientAlive: Client $clientId Disconnected.")
              _ <- ZIO.interrupt
            } yield ()
          }
          newclientStatus <- clientStatusRef.get
          _ <- ZIO.debug(s"isClientAlive: Client $clientId is alive")
          _ <- ZIO.debug(s"isClientAlive: newclientStatus $newclientStatus")
          _ <- clientStatusRef.update(_ + (clientId -> false))
        } yield ()
      ).repeat(Schedule.fixed(20.seconds))
    } yield ()
}