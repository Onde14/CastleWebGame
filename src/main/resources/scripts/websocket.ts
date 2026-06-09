import type { MessageHandler } from "./messagehandling";

export class WebSocketDriver {
  isOpen = false;
  wsUri: string;
  webSocket: WebSocket | null;
  messageHandler: MessageHandler;

  constructor(messageHandler: MessageHandler) {
    this.wsUri = "ws://localhost:8080/ws";
    this.webSocket = new WebSocket(this.wsUri);
    this.messageHandler = messageHandler;
    this.createListeners()




  }
  createListeners() {
    // Connection opened
    this.webSocket?.addEventListener("open", (event) => {
      this.webSocket?.send("Hello Server!");
    });

    // Listen for messages
    this.webSocket?.addEventListener("message", (event) => {
      console.log("Message from server:", event.data);
      this.messageHandler.incoming(event.data)
    });

    // Handle errors
    this.webSocket?.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    // Handle disconnection
    this.webSocket?.addEventListener("close", (event) => {
      if (event.wasClean) {
        console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.log("Connection died");
      }
    });
  }

  public sendMessage(message: string): void {
      this.webSocket?.send(message);
     // console.log("Message sent to server!")
  }

  public closeConnection() {

    this.webSocket?.close();
    //this.webSocket = null;
    console.log("Closed connection")
  }

  public openConnection() {
    this.webSocket = new WebSocket(this.wsUri)
    console.log("Opened connection")
  }
}
