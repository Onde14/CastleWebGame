import { WebSocketDriver } from "./websocket.js";
import { Player } from "./gamestate.js";
import { EventHandler } from "./events.js";
import { Soldier, Castle } from "./objects.js";
export class MessageHandler {
    webSocketDriver;
    eventHandler;
    constructor(eventHandler) {
        this.webSocketDriver = new WebSocketDriver(this);
        this.eventHandler = eventHandler;
    }
    handleResponse(msg) {
        //console.log("TYPE IS ", msg.msgType);
        switch (msg.msgType) {
            case "BuildGame":
                if (msg.currentPlayerId !== undefined && msg.players !== undefined) {
                    this.eventHandler.buildGameStateEvent(msg.currentPlayerId, msg.players);
                    break;
                }
                else {
                    throw new Error("Unknown types in the message");
                }
            case "Message":
                break;
            case "AttackOrder":
                if (msg.soldiers !== undefined) {
                    this.eventHandler.attackOrderEvent(msg.soldiers);
                    break;
                }
                else {
                    throw new Error("Unknown types in the message");
                }
            case "UpdatedGameState":
                if (msg.updates !== undefined) {
                    this.eventHandler.updateGameStateEvent(msg.updates);
                }
                break;
            default:
                throw new Error("Unknown message type!");
        }
    }
    incoming(msg) {
        console.log("MESSAGE:::", msg);
        try {
            const parsedJson = JSON.parse(msg);
            //console.log(parsedJson);
            this.handleResponse(parsedJson);
        }
        catch (error) {
            console.log("Couldn't parse incoming message: ", error);
        }
    }
    send(object) {
        this.webSocketDriver.sendMessage(JSON.stringify(object));
    }
}
//# sourceMappingURL=messagehandling.js.map