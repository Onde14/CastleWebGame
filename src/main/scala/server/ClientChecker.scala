package server
import java.util.UUID
import zio._
import server.*


import server.MainApp.clientsInLobbiesRef

class ClientChecker(clientId: UUID, clientStatusRef: Ref[Map[UUID, Int]], clientsInLobbiesRef: Ref[Map[UUID,Lobby]], lobbiesRef: Ref[Set[Lobby]]):

  def startClientChecker() =
    for {
      checker <- checker().repeat(Schedule.fixed(1.seconds))
    } yield checker


  def checker() =
    for {
      clientStatus <- clientStatusRef.get
      status = clientStatus.get(clientId).getOrElse(0)
      //_ <- ZIO.debug(s"isClientAlive: Checking on $clientId, status: $status")
      _ <- ZIO.when(status > 10){
        for {
          _ <- ZIO.debug(s"isClientAlive: Client $clientId DISCONNECTED.")
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
      newClientStatus <- clientStatusRef.get
      newStatus = newClientStatus.get(clientId).getOrElse(0)
      _ <- clientStatusRef.update(_ + (clientId -> (newStatus + 1)))
     // _ <- ZIO.sleep(1.seconds)
    } yield ()