import { Gamestate, Player } from "./gamestate.js";
import { Soldier, Castle } from "./objects.js";
import { Vector } from "./vector.js";
import type { Controls } from "./controls.js";
import type { DisplayDriver } from "./display-driver.js";
import { MessageHandler } from "./messagehandling.js";

export class EventHandler {
  canvas: HTMLCanvasElement;
  gameState: Gamestate;
  controls: Controls;
  displayDriver: DisplayDriver;
  messageHandler?: MessageHandler;
  constructor(
    canvas: HTMLCanvasElement,
    gameState: Gamestate,
    controls: Controls,
    displayDriver: DisplayDriver,
  ) {
    this.canvas = canvas;
    this.gameState = gameState;
    this.controls = controls;
    this.displayDriver = displayDriver;
  }

  mouseDown(e: MouseEvent) {
    let target = new Vector(e.clientX, e.clientY);
    console.log("Coordinate x: " + target.x, "Coordinate y: " + target.y);
    let castles = new Array<Castle>();
    let currPlayer = "";
    this.gameState.players.forEach((player) => {
      if (player.id == this.gameState.currentPlayerId) {
        currPlayer = player.id;
      }
      castles = castles.concat(player.castles);
    });
    //console.log("CASTLES: ", castles);
    const orders: any = this.controls.mouseDown(target, castles, currPlayer);
    if (orders === undefined) {
      console.log("NO ORDERS.");
    } else {
      console.log("GOT ORDERS!");
      console.log("ORDERS: " + orders);
      if (this.messageHandler) {
        let requestJson = {
          msgType: "RequestAttackOrderMessage",
          target_castle_id: orders.target_castle_id,
          selected_castles_ids: orders.selected_castles_ids,
        };
        this.messageHandler.send(requestJson);
      }
    }
  }

  mouseMove(e: MouseEvent) {
    if (this.controls.isSelecting) {
      const target = new Vector(e.clientX, e.clientY);
      let castles = new Array<Castle>();
      this.gameState.players.forEach((player) => {
        castles = castles.concat(player.castles);
      });
      this.controls.mouseMove(target, castles);
    }
  }

  public startConnection() {
    this.messageHandler = new MessageHandler(this);
  }

  public eventHandling() {
    this.canvas.addEventListener("mousedown", (e) => this.mouseDown(e));

    this.canvas.addEventListener("mousemove", (e) => this.mouseMove(e));

    window.addEventListener("resize", () => this.displayDriver.resize());
  }
  public buildGameStateEvent(players: any,) {
    this.gameState.buildGameState(players);
  }

  public attackOrderEvent(soldiers: any) {
    this.gameState.createSoldiers(soldiers);
  }

  public updateGameStateEvent(updates: any) {
    this.gameState.update(updates);
  }

  public setCurrentPlayerId(clientId: string) {
    this.gameState.setCurrentPlayerId(clientId);
  }

}
