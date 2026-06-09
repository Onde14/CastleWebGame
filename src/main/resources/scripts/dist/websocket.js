export class WebSocketDriver {
    isOpen = false;
    wsUri;
    webSocket;
    messageHandler;
    constructor(messageHandler) {
        this.wsUri = "ws://localhost:8080/ws";
        this.webSocket = new WebSocket(this.wsUri);
        this.messageHandler = messageHandler;
        this.createListeners();
    }
    createListeners() {
        // Connection opened
        this.webSocket?.addEventListener("open", (event) => {
            this.webSocket?.send("Hello Server!");
        });
        // Listen for messages
        this.webSocket?.addEventListener("message", (event) => {
            console.log("Message from server:", event.data);
            this.messageHandler.incoming(event.data);
        });
        // Handle errors
        this.webSocket?.addEventListener("error", (event) => {
            console.error("WebSocket error:", event);
        });
        // Handle disconnection
        this.webSocket?.addEventListener("close", (event) => {
            if (event.wasClean) {
                console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
            }
            else {
                console.log("Connection died");
            }
        });
    }
    sendMessage(message) {
        this.webSocket?.send(message);
        // console.log("Message sent to server!")
    }
    closeConnection() {
        this.webSocket?.close();
        //this.webSocket = null;
        console.log("Closed connection");
    }
    openConnection() {
        this.webSocket = new WebSocket(this.wsUri);
        console.log("Opened connection");
    }
}
//# sourceMappingURL=websocket.js.map