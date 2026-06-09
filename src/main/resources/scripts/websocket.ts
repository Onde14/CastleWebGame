import type { MessageHandler } from "./messagehandling";

export class WebSocketDriver {
  isOpen = false;
  wsUri = "ws://localhost:8080/ws";;
  webSocket: WebSocket | null = null;
  messageHandler: MessageHandler;

  constructor(messageHandler: MessageHandler) {
    this.messageHandler = messageHandler;
  }


  public closeConnection() {
    if (this.webSocket) {
      this.webSocket.close(1000, "Client disconnected.");
      this.webSocket = null;
    }
  }

  public openConnection() {
    this.closeConnection()
    this.webSocket = new WebSocket(this.wsUri)
    this.webSocket.onopen = () => {
      console.log("Opened new connection!")
    }

    this.webSocket.onclose = (event) => {
      console.log(`Disconnected: ${event.reason}`);
      this.webSocket = null;
    }

    this.webSocket.onerror = (event) => {
      console.error("Error:", event)
    }

    this.webSocket.onmessage = (event) => {
      this.messageHandler.incoming(event.data)
    }
  }

  public sendMessage(message: string): void {
    this.webSocket?.send(message);
    // console.log("Message sent to server!")
  }
}