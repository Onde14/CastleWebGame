export class WebSocketDriver {
    isOpen = false;
    wsUri = "ws://localhost:8080/ws";
    ;
    webSocket = null;
    messageHandler;
    constructor(messageHandler) {
        this.messageHandler = messageHandler;
    }
    closeConnection() {
        if (this.webSocket) {
            this.webSocket.close(1000, "Client disconnected.");
            this.webSocket = null;
        }
    }
    openConnection() {
        this.closeConnection();
        this.webSocket = new WebSocket(this.wsUri);
        this.webSocket.onopen = () => {
            console.log("Opened new connection!");
        };
        this.webSocket.onclose = (event) => {
            console.log(`Disconnected: ${event.reason}`);
            this.webSocket = null;
        };
        this.webSocket.onerror = (event) => {
            console.error("Error:", event);
        };
        this.webSocket.onmessage = (event) => {
            this.messageHandler.incoming(event.data);
        };
    }
    sendMessage(message) {
        this.webSocket?.send(message);
        // console.log("Message sent to server!")
    }
}
//# sourceMappingURL=websocket.js.map