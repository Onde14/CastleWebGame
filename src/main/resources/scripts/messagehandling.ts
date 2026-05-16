import { WebSocketDriver } from "./websocket.js";
import { Player } from "./gamestate.js";
import { EventHandler } from "./events.js";

type ResponseMessage = {
  msgType: string;
  time?: string;
  your_id?: number;
  id?: number;
  color?: string;
  message?: string;
  players?: any;
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
      case "buildGame":
        if (msg.your_id !== undefined && msg.players !== undefined) {
          this.eventHandler.buildGameState(msg.your_id, msg.players);
          break;
        } else {
          throw new Error("Unknown types in the message");
        }
      case "Message":
        break;
      default:
        throw new Error("Unknown message type!");
    }
  }

  public incoming(msg: string) {
    const parsedJson: ResponseMessage = JSON.parse(msg);
    console.log(parsedJson);
    this.handleResponse(parsedJson);
  }

  public send(msg: string) {
    this.webSocketDriver.sendMessage(msg);
  }
}
