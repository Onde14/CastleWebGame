import { Soldier, Castle, Road } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { RoadSize } from "./config.js";

let message = "Hello World!";
console.log(message);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvas_width = canvas.width;
const canvas_height = canvas.height;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const canvas_cwidth = canvas.clientWidth;
const canvas_cheight = canvas.clientHeight;

console.log("PW: ", canvas_width, ", CW: ", canvas_cwidth);
console.log("PH: ", canvas_height, ", CH ", canvas_cheight)

export class Game {
  displayDriver: DisplayDriver;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  units = []
  constructor() {
    this.displayDriver = new DisplayDriver();
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  roadBuild(start: Vector, end: Vector){
    let road_height = Math.hypot((end.x-start.x),(end.y-start.y));
    let road_rotation = Math.atan2((end.y-start.y),(end.x-start.x));
    this.ctx.fillStyle = "brown";
    this.ctx.fillRect(start.x,start.y,RoadSize.width,road_height);
  }

  buildGame() {
    //header =
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, canvas_width, canvas_height);

    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(canvas_width/2-25, 50, 50, 50);

    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(canvas_width/2-25, canvas_height-100, 50, 50);

    this.ctx.fillStyle = "brown";
    this.ctx.fillRect(canvas_width/2-5, 100, 10, canvas_height-200);

    const dude = new Soldier(canvas_width/2,canvas_height/2);
    this.ctx.beginPath();
    this.ctx.arc(canvas_width / 2, canvas_height / 2, 15, 0, Math.PI * 2);
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