export class WebSocketDriver {
    open = false;
    wsUri;
    webSocket;
    messageHandler;
    constructor(messageHandler) {
        this.wsUri = "ws://localhost:8080/ws";
        this.webSocket = new WebSocket(this.wsUri);
        this.messageHandler = messageHandler;
        this.webSocket.onopen = (event) => {
            console.log("Connected to ZIO server!", event);
            this.sendMessage(JSON.stringify({ msgType: "HelloMessage" }));
        };
        this.webSocket.onmessage = (event) => {
            this.messageHandler.incoming(event.data);
        };
        this.webSocket.onclose = (event) => {
            console.log("Connection closed", event.reason);
        };
        this.webSocket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    }
    sendMessage(message) {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(message);
            // console.log("Message sent to server!")
        }
        else {
            console.error("Socket is not open.");
        }
    }
}
//# sourceMappingURL=websocket.js.map