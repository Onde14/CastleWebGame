import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { Controls } from "./controls.js";
import { Gamestate, Player } from "./gamestate.js";
import { EventHandler } from "./events.js";
import { UserInterface } from "./ui.js";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Game {
  gameWidth: number;
  gameHeight: number;
  displayDriver: DisplayDriver;
  gameState: Gamestate;
  controls: Controls;
  ui: UserInterface;
  eventHandler: EventHandler;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.gameWidth = this.canvas.width;
    this.gameHeight = this.canvas.height;
    this.ui = new UserInterface(this.gameWidth,this.gameHeight)

    this.gameState = new Gamestate(this.ui);
    this.controls = new Controls(this.gameWidth, this.gameHeight,this.gameState,this.ui);
    this.displayDriver = new DisplayDriver(
      this.ui,
      this.gameState,
      this.canvas,
      this.ctx,
      this.gameWidth,
      this.gameHeight,
    );
    this.displayDriver.resize();
    this.eventHandler = new EventHandler(
      this.canvas,
      this.gameState,
      this.controls,
      this.displayDriver,
      this.ui
    );
    this.eventHandler.eventHandling();
  }
  found_goal(pos: Vector, target: Vector) {
    return Math.abs(pos.x - target.x) < 0.5 && Math.abs(pos.y - target.y) < 0.5;
  }

  private debug_print() {
    console.log(this.gameState.players);
  }

  public run() {
    this.debug_print();
    this.draw(0);
  }

  public draw(t: number) {
    //console.log(this.canvas);
    //console.log("DRAWING")
    this.displayDriver.draw();
    //console.log((Math.trunc(t % 5000)))
    if (Math.trunc(t % 50) > 43) {
      //console.log("TICKING:",(Math.trunc(t % 100)))
      this.eventHandler.sendTick();
    }
    window.requestAnimationFrame((t) => {
      this.draw(t);
    });

  }
}

const game = new Game();
game.run();
