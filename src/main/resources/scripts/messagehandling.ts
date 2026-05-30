import { WebSocketDriver } from "./websocket.js";
import { Player } from "./gamestate.js";
import { EventHandler } from "./events.js";
import { Soldier, Castle } from "./objects.js";

type ResponseMessage = {
  msgType: string;
  time?: string;
  your_id?: number;
  id?: number;
  color?: string;
  message?: string;
  players?: any;
  soldiers?: any;
};

export class MessageHandler {
  webSocketDriver: WebSocketDriver;
  eventHandler: EventHandler;
  constructor(eventHandler: EventHandler) {
    this.webSocketDriver = new WebSocketDriver(this);
    this.eventHandler = eventHandler;
  }

  private handleResponse(msg: ResponseMessage) {
    console.log("TYPE IS ", msg.msgType);
    if (msg.msgType == "buildGame") {
      console.log(true);
    }
    switch (msg.msgType) {
      case "BuildGame":
        if (msg.your_id !== undefined && msg.players !== undefined) {
          this.eventHandler.buildGameState(msg.your_id, msg.players);
          break;
        } else {
          throw new Error("Unknown types in the message");
        }
      case "Message":
        break;
      case "AttackOrder":
        if (msg.soldiers !== undefined) {
          this.eventHandler.attackOrder(msg.soldiers);
          break;
        } else {
          throw new Error("Unknown types in the message");
        }
      case "UpdatedGameState":
        if (msg.players !== undefined) {
          this.eventHandler.updateGameState(msg.players);
        }
      default:
        throw new Error("Unknown message type!");
    }
  }

  public incoming(msg: string) {
    console.log("MESSAGE:::", msg);
    try {
      const parsedJson: ResponseMessage = JSON.parse(msg);
      console.log(parsedJson);
      this.handleResponse(parsedJson);
    } catch (error) {
      console.log("Couldn't parse incoming message.");
    }
  }

  public send(object: any) {
    this.webSocketDriver.sendMessage(JSON.stringify(object));
  }
}
