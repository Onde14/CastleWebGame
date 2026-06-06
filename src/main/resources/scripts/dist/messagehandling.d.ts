import { WebSocketDriver } from "./websocket.js";
import { EventHandler } from "./events.js";
export declare class MessageHandler {
    webSocketDriver: WebSocketDriver;
    eventHandler: EventHandler;
    myClientId: string;
    myLobbyId: string;
    constructor(eventHandler: EventHandler);
    private handleResponse;
    incoming(msg: string): void;
    send(object: any): void;
}
//# sourceMappingURL=messagehandling.d.ts.map