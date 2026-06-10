import { WebSocketDriver } from "./websocket.js";
import { Player } from "./gamestate.js";
import { EventHandler } from "./events.js";
import { Soldier, Castle } from "./objects.js";

type ResponseMessage = {
  msgType: string;
  time?: string;
  currentPlayerId?: number;
  currentPlayerColor?: string;
  id?: string;
  color?: string;
  message?: string;
  players?: any;
  updates?: any;
  soldiers?: any;
  Soldier?: any;
  lobbyId?: string;
  clientId?: string;
  tick?: number;
  winner?: string;
  money?: number;
  ai?: boolean;
  state?: number;
};

export class MessageHandler {
  webSocketDriver: WebSocketDriver;
  eventHandler: EventHandler;
  myClientId: string = "";
  myLobbyId: string = "";
  constructor(eventHandler: EventHandler) {
    this.webSocketDriver = new WebSocketDriver(this);
    this.eventHandler = eventHandler;
  }

  public open() {
    this.webSocketDriver.openConnection();
  }

  private handleResponse(msg: ResponseMessage) {
    //console.log("TYPE IS ", msg.msgType);
    if (msg.msgType === undefined) return;
    switch (msg.msgType) {
      case "BuildGameDataMessage":
        if (msg.players !== undefined) {
          this.eventHandler.buildGameStateEvent(msg.players);
          break;
        } else {
          throw new Error("Unknown types in the message");
        }
      case "Message":
        break;
      case "ResponseAttackOrderMessage":
        if (msg.soldiers !== undefined && msg.money !== undefined) {
          this.eventHandler.responseAttackOrder(msg.soldiers, msg.money);
          break;
        } else {
          throw new Error("Unknown types in the message");
        }
      case "UpdatedGameState":
        if (msg.updates !== undefined && msg.tick !== undefined) {
          this.eventHandler.updateGameStateEvent(msg.updates, msg.tick);
        }
        break;
      case "HelloMessage":
        console.log("Got the ",msg.msgType, "back.");
        break;
      case "ClientInfoMessage":
        console.log("Got the", msg.msgType + ".");
        console.log(msg.lobbyId)
        if (msg.lobbyId !== undefined){
          this.myLobbyId = msg.lobbyId;
          console.log("this.myLobbyId:",this.myLobbyId)
        }
        if (msg.clientId !== undefined) {
          this.myClientId = msg.clientId
          this.eventHandler.setCurrentPlayerId(msg.clientId)
        }

        console.log(this.myClientId,this.myLobbyId)
        break;
      case "GameEndMessage":
        this.eventHandler.gameEnd(msg.winner!)
        break;
      case "InvalidMessage":
        console.log("Request was invalid!")
        break;
      case "CPUUpdateDataMessage":
        console.log("CPUUpdateDataMessage",msg.soldiers!)
        this.eventHandler.CPUcreateUnit(msg.state!,msg.money!,msg.soldiers!)
        break;

      default:
        throw new Error("Unknown message type!");
    }
  }

  public incoming(msg: string) {
    //console.log("MESSAGE:::", msg)
    try {
      const parsedJson: ResponseMessage = JSON.parse(msg);
      //console.log(parsedJson);
      this.handleResponse(parsedJson);
    } catch (error) {
      console.log("Couldn't parse incoming message: ", error);
    }
  }

  public send(object: any) {
    object.clientId = this.myClientId;
    object.lobbyId = this.myLobbyId;
    //console.log("Sending object:", object)
    this.webSocketDriver.sendMessage(JSON.stringify(object));
  }


}
