import type { MessageHandler } from "./messagehandling";
export declare class WebSocketDriver {
    isOpen: boolean;
    wsUri: string;
    webSocket: WebSocket | null;
    messageHandler: MessageHandler;
    constructor(messageHandler: MessageHandler);
    closeConnection(): void;
    openConnection(): void;
    sendMessage(message: string): void;
}
//# sourceMappingURL=websocket.d.ts.map