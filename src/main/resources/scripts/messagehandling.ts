import { WebSocketDriver } from "./websocket.js";
import { Player } from "./gamestate.js";
import { EventHandler } from "./events.js";
import { Soldier, Castle } from "./objects.js";

type ResponseMessage = {
  msgType: string;
  time?: string;
  currentPlayerId?: number;
  currentPlayerColor?: string;
  color?: string;
  message?: string;
  players?: any;
  updates?: any;
  soldiers?: any;
  Soldier?: any;
  lobbyId?: string;
  clientId?: string;
};

export class MessageHandler {
  webSocketDriver: WebSocketDriver;
  eventHandler: EventHandler;
  constructor(eventHandler: EventHandler) {
    this.webSocketDriver = new WebSocketDriver(this);
    this.eventHandler = eventHandler;
  }

  private handleResponse(msg: ResponseMessage) {
    //console.log("TYPE IS ", msg.msgType);
    switch (msg.msgType) {
      case "BuildGameDataMessage":
        if (
          msg.currentPlayerId !== undefined &&
          msg.currentPlayerColor &&
          msg.players !== undefined
        ) {
          this.eventHandler.buildGameStateEvent(
            msg.currentPlayerId,
            msg.currentPlayerColor,
            msg.players,
          );
          break;
        } else {
          throw new Error("Unknown types in the message");
        }
      case "Message":
        break;
      case "AttackOrder":
        if (msg.soldiers !== undefined) {
          this.eventHandler.attackOrderEvent(msg.soldiers);
          break;
        } else {
          throw new Error("Unknown types in the message");
        }
      case "UpdatedGameState":
        if (msg.updates !== undefined) {
          this.eventHandler.updateGameStateEvent(msg.updates);
        }
        break;
      case "HelloMessage":
        console.log("Got the ",msg.msgType, "back.");
        break;
      case "ClientInfoMessage":
        console.log("Got the ",msg.msgType + ".");
        break;
      default:
        throw new Error("Unknown message type!");
    }
  }

  public incoming(msg: string) {
    console.log("MESSAGE:::", msg);
    try {
      const parsedJson: ResponseMessage = JSON.parse(msg);
      //console.log(parsedJson);
      this.handleResponse(parsedJson);
    } catch (error) {
      console.log("Couldn't parse incoming message: ", error);
    }
  }

  public send(object: any) {
    this.webSocketDriver.sendMessage(JSON.stringify(object));
  }
}
