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

  mouse_down(e: MouseEvent) {
    let target = new Vector(e.clientX, e.clientY);
    console.log("Coordinate x: " + target.x, "Coordinate y: " + target.y);
    let castles = new Array<Castle>();
    let currPlayer = 0;
    this.gameState.players.forEach((player) => {
      if (player.id == this.gameState.currentPlayerId) {
        currPlayer = player.id;
      }
      castles = castles.concat(player.castles);
    });
    console.log("CASTLES: ", castles);
    const orders: any = this.controls.mouse_down(target, castles, currPlayer);
    if (orders === undefined) {
      console.log("NO ORDERS.");
    } else {
      console.log("GOT ORDERS!");
      console.log("ORDERS: " + orders);

      if (this.messageHandler) {
        const requestJson = {
          msgType: "AttackOrder",
          playerId: currPlayer,
          target_castle: orders.target_castle,
          selected_castles: orders.selected_castles,
        };
        this.messageHandler.send(requestJson);
      }
    }
  }

  mouse_move(e: MouseEvent) {
    if (this.controls.is_selecting) {
      let target = new Vector(e.clientX, e.clientY);
      let castles = new Array<Castle>();
      this.gameState.players.forEach((player) => {
        castles = castles.concat(player.castles);
      });
      this.controls.mouse_move(target, castles);
    }
  }

  public startConnection() {
    this.messageHandler = new MessageHandler(this);
  }

  public event_handling() {
    this.canvas.addEventListener("mousedown", (e) => this.mouse_down(e));

    this.canvas.addEventListener("mousemove", (e) => this.mouse_move(e));

    window.addEventListener("resize", () => this.displayDriver.resize());
  }

  public buildGameState(currentPlayerId: number, players: any) {
    console.log("PLAYERS1: ", players);
    this.gameState.currentPlayerId = currentPlayerId;
    let playerArray = new Array<Player>();
    players.forEach((player: any) => {
      let newPlayer = new Player(
        false,
        player.id,
        new Array<Soldier>(),
        new Array<Castle>(),
        player.color,
      );
      player.castles.forEach((castle: any) => {
        const newCastle = new Castle(
          new Vector(castle.pos.x, castle.pos.y),
          castle.id,
          castle.owner,
          castle.ownerColor,
        );
        newPlayer.castles.push(newCastle);
      });
      player.units.forEach((unit: any) => {
        const newSoldier = new Soldier(
          new Vector(unit.pos.x, unit.pos.y),
          unit.id,
          unit.owner,
          unit.ownerColor,
        );
        if (unit.target !== undefined) {
          newSoldier.give_target(new Vector(unit.target.x, unit.target.y));
        }
        newPlayer.units.push(newSoldier);
      });
      playerArray.push(newPlayer);
    });
    this.gameState.players = playerArray;
    console.log("PLAYERS2: ", this.gameState.players);
  }

  public attackOrder(soldiers: any) {
    this.gameState.create_soldiers(soldiers);
  }

  public updateGameState(players: any) {
    this.gameState.update(players);
  }
}
