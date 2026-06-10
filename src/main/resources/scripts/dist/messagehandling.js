import { WebSocketDriver } from "./websocket.js";
export class MessageHandler {
    webSocketDriver;
    eventHandler;
    myClientId = "";
    myLobbyId = "";
    constructor(eventHandler) {
        this.webSocketDriver = new WebSocketDriver(this);
        this.eventHandler = eventHandler;
    }
    open() {
        this.webSocketDriver.openConnection();
    }
    handleResponse(msg) {
        //console.log("TYPE IS ", msg.msgType);
        switch (msg.msgType) {
            case "BuildGameDataMessage":
                if (msg.players !== undefined) {
                    this.eventHandler.buildGameStateEvent(msg.players);
                    break;
                }
                else {
                    throw new Error("Unknown types in the message");
                }
            case "Message":
                break;
            case "ResponseAttackOrderMessage":
                if (msg.soldiers !== undefined && msg.money !== undefined) {
                    this.eventHandler.responseAttackOrder(msg.soldiers, msg.money);
                    break;
                }
                else {
                    throw new Error("Unknown types in the message");
                }
            case "UpdatedGameState":
                if (msg.updates !== undefined && msg.tick !== undefined) {
                    this.eventHandler.updateGameStateEvent(msg.updates, msg.tick);
                }
                break;
            case "HelloMessage":
                console.log("Got the ", msg.msgType, "back.");
                break;
            case "ClientInfoMessage":
                console.log("Got the", msg.msgType + ".");
                console.log(msg.lobbyId);
                if (msg.lobbyId !== undefined) {
                    this.myLobbyId = msg.lobbyId;
                    console.log("this.myLobbyId:", this.myLobbyId);
                }
                if (msg.clientId !== undefined) {
                    this.myClientId = msg.clientId;
                    this.eventHandler.setCurrentPlayerId(msg.clientId);
                }
                console.log(this.myClientId, this.myLobbyId);
                break;
            case "GameEndMessage":
                this.eventHandler.gameEnd(msg.winner);
                break;
            case "InvalidMessage":
                console.log("Request was invalid!");
                break;
            default:
                throw new Error("Unknown message type!");
        }
    }
    incoming(msg) {
        // console.log("MESSAGE:::", msg)
        try {
            const parsedJson = JSON.parse(msg);
            // console.log(parsedJson);
            this.handleResponse(parsedJson);
        }
        catch (error) {
            console.log("Couldn't parse incoming message: ", error);
        }
    }
    send(object) {
        object.clientId = this.myClientId;
        object.lobbyId = this.myLobbyId;
        //console.log("Sending object:", object)
        this.webSocketDriver.sendMessage(JSON.stringify(object));
    }
}
//# sourceMappingURL=messagehandling.js.map