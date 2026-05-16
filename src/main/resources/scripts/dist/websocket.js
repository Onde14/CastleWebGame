var ClientMessage;
(function (ClientMessage) {
    ClientMessage[ClientMessage["openConnection"] = 1] = "openConnection";
})(ClientMessage || (ClientMessage = {}));
export class WebSocketDriver {
    open = false;
    wsUri;
    webSocket;
    constructor() {
        this.wsUri = "ws://localhost:8080/ws";
        this.webSocket = new WebSocket(this.wsUri);
        this.webSocket.onopen = (event) => {
            console.log("Connected to ZIO server!", event);
            this.sendMessage("Hello from TypeScript!");
        };
        this.webSocket.onmessage = (event) => {
            console.log("Message from server:", event.data);
            //try {
            const parserJson = JSON.parse(event.data);
            console.log("TEST: ", parserJson);
            //} catch (SyntaxError) {
            //  console.log("Couldn't parse message!");
            //}
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
        }
        else {
            console.error("Socket is not open.");
        }
    }
}
//# sourceMappingURL=websocket.js.map