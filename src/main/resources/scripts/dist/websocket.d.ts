import type { MessageHandler } from "./messagehandling";
export declare class WebSocketDriver {
    isOpen: boolean;
    wsUri: string;
    webSocket: WebSocket | null;
    messageHandler: MessageHandler;
    constructor(messageHandler: MessageHandler);
    createListeners(): void;
    sendMessage(message: string): void;
    closeConnection(): void;
    openConnection(): void;
}
//# sourceMappingURL=websocket.d.ts.map