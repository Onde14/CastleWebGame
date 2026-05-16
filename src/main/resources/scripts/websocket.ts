import type { MessageHandler } from "./messagehandling";

export class WebSocketDriver {
  open = false;
  wsUri: string;
  webSocket: WebSocket;
  messageHandler: MessageHandler;

  constructor(messageHandler: MessageHandler) {
    this.wsUri = "ws://localhost:8080/ws";
    this.webSocket = new WebSocket(this.wsUri);
    this.messageHandler = messageHandler;

    this.webSocket.onopen = (event) => {
      console.log("Connected to ZIO server!", event);
      this.sendMessage("Hello from TypeScript!");
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

  public sendMessage(message: string): void {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(message);
    } else {
      console.error("Socket is not open.");
    }
  }
}
