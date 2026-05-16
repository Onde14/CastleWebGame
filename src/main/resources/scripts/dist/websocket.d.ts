import type { MessageHandler } from "./messagehandling";
export declare class WebSocketDriver {
    open: boolean;
    wsUri: string;
    webSocket: WebSocket;
    messageHandler: MessageHandler;
    constructor(messageHandler: MessageHandler);
    sendMessage(message: string): void;
}
//# sourceMappingURL=websocket.d.ts.map