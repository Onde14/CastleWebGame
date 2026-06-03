import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { Controls } from "./controls.js";
import { Gamestate, Player } from "./gamestate.js";
import { EventHandler } from "./events.js";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Game {
  gameWidth: number;
  gameHeight: number;
  displayDriver: DisplayDriver;
  gameState: Gamestate;
  controls: Controls;
  eventHandler: EventHandler;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.gameWidth = this.canvas.width;
    this.gameHeight = this.canvas.height;
    this.displayDriver = new DisplayDriver(
      this.canvas,
      this.ctx,
      this.gameWidth,
      this.gameHeight,
    );
    this.displayDriver.resize();
    this.gameState = new Gamestate(this.displayDriver);
    this.controls = new Controls();
    console.log("Game built");
    this.eventHandler = new EventHandler(
      this.canvas,
      this.gameState,
      this.controls,
      this.displayDriver,
    );
    this.eventHandler.event_handling();
  }
  found_goal(pos: Vector, target: Vector) {
    return Math.abs(pos.x - target.x) < 0.5 && Math.abs(pos.y - target.y) < 0.5;
  }

  private debug_print() {
    console.log(this.gameState.players);
  }

  public run() {
    this.debug_print();
    this.eventHandler.startConnection();
    this.draw(0);
  }

  public async draw(t: number) {
    //console.log(this.canvas);

    this.gameState.players.forEach((player) => {
      if (t % 1000 == 0) {
        console.log(player);
      }
      this.displayDriver.draw(
        this.gameState.gameObjects,
        this.gameState.currentPlayerColor,
      );
    });
    await sleep(16);
    window.requestAnimationFrame((t) => {
      this.draw(t);
    });
  }
}

const game = new Game();
game.run();
