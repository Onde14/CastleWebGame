import { Unit } from "./units.js";
import { DisplayDriver } from "./display-driver.js";

let message = "Hello World!";
console.log(message);

enum WINDOW {
  WIDTH = 500,
  HEIGHT = 500,
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export class Game {
  displayDriver: DisplayDriver;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  Units: Unit[] = [];
  constructor() {
    this.displayDriver = new DisplayDriver();
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  buildGame() {
    //header =
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, WINDOW.WIDTH, WINDOW.HEIGHT);

    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(225, 50, 50, 50);

    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(225, 400, 50, 50);

    this.ctx.fillStyle = "brown";
    this.ctx.fillRect(245, 100, 10, 300);

    const dude = new Unit();
    this.ctx.beginPath();
    this.ctx.arc(WINDOW.WIDTH / 2, WINDOW.HEIGHT / 2, 15, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    console.log("Game built");
  }

  /*   run() {
    this.draw(0);
  }

  private draw(tick: number) {
    let next = tick + 1;
    requestAnimationFrame(this.draw);
    }*/
}

const game = new Game();
game.buildGame();
game.run();
