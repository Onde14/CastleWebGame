import { WebSocketDriver } from "./websocket.js";
import { Player } from "./gamestate.js";
import { EventHandler } from "./events.js";
export class MessageHandler {
    webSocketDriver;
    eventHandler;
    constructor(eventHandler) {
        this.webSocketDriver = new WebSocketDriver(this);
        this.eventHandler = eventHandler;
    }
    handleResponse(msg) {
        console.log("TYPE IS ", msg.msgType);
        if (msg.msgType == "buildGame") {
            console.log(true);
        }
        switch (msg.msgType) {
            case "buildGame":
                if (msg.your_id !== undefined && msg.players !== undefined) {
                    this.eventHandler.buildGameState(msg.your_id, msg.players);
                    break;
                }
                else {
                    throw new Error("Unknown types in the message");
                }
            case "Message":
                break;
            default:
                throw new Error("Unknown message type!");
        }
    }
    incoming(msg) {
        const parsedJson = JSON.parse(msg);
        console.log(parsedJson);
        this.handleResponse(parsedJson);
    }
    send(msg) {
        this.webSocketDriver.sendMessage(msg);
    }
}
//# sourceMappingURL=messagehandling.js.map