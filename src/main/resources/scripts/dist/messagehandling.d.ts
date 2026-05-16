import { WebSocketDriver } from "./websocket.js";
import { EventHandler } from "./events.js";
export declare class MessageHandler {
    webSocketDriver: WebSocketDriver;
    eventHandler: EventHandler;
    constructor(eventHandler: EventHandler);
    private handleResponse;
    incoming(msg: string): void;
    send(msg: string): void;
}
//# sourceMappingURL=messagehandling.d.ts.map