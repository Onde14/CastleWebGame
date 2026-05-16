import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { Controls } from "./controls.js";
import { Gamestate, Player } from "./gamestate.js";
import { EventHandler } from "./events.js";

let message = "Hello World!";
console.log(message);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvas_width = canvas.width;
const canvas_height = canvas.height;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const canvas_cwidth = canvas.clientWidth;
const canvas_cheight = canvas.clientHeight;

console.log("PW: ", canvas_width, ", CW: ", canvas_cwidth);
console.log("PH: ", canvas_height, ", CH ", canvas_cheight);

export class Game {
  gameWidth: number;
  gameHeight: number;
  displayDriver: DisplayDriver;
  gameState: Gamestate;
  controls: Controls;
  eventHandler: EventHandler;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  //units = new Map<number,Soldier>();
  //moving_units = new Array<Soldier>;
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
    this.gameState = new Gamestate(this.displayDriver, new Array<Player>(), 0);
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

  /*road_build(start: Vector, end: Vector) {
    let road_height = Math.hypot(end.x - start.x, end.y - start.y);
    let road_rotation = Math.atan2(end.y - start.y, end.x - start.x);
    this.ctx.fillStyle = "brown";
    this.ctx.fillRect(start.x, start.y, RoadConfig.width, road_height);
  }
  */

  found_goal(pos: Vector, target: Vector) {
    return Math.abs(pos.x - target.x) < 0.5 && Math.abs(pos.y - target.y) < 0.5;
  }

  /*private build_game() {
    let player1 = new Player(
      false,
      new Array<Soldier>(),
      new Array<Castle>(),
      "blue",
    );
    let castle1 = new Castle(
      new Vector(
        this.gameWidth / 2,
        this.gameHeight - 100 + CastleConfig.height / 2,
      ),
      player1.id,
      player1.color,
    );
    console.log("Castle info: ", castle1.pos.x, ",", castle1.pos.y);
    player1.castles.push(castle1);
    let soldier1 = new Soldier(
      new Vector(this.gameWidth / 2, this.gameHeight / 2),
      player1.id,
      player1.color,
    );
    player1.units.push(soldier1);
    this.gameState.currentPlayerId = player1.id;
    this.gameState.players.push(player1);

    let player2 = new Player(
      true,
      new Array<Soldier>(),
      new Array<Castle>(),
      "red",
    );
    let castle2 = new Castle(
      new Vector(this.gameWidth / 2, 50),
      player2.id,
      player2.color,
    );
    player2.castles.push(castle2);
    this.gameState.players.push(player2);

    let soldierx: Soldier = <Soldier>player1.units.at(0);
    soldierx.give_target(new Vector(100, 100));

    let soldier2 = new Soldier(800,250);
    soldier2.give_target(462,132);
    this.units.set(soldier2.unit.id, soldier2);
    this.moving_units.push(soldier2);
    let soldier3 = new Soldier(300,500);
    soldier3.give_target(350,666);
    this.units.set(soldier3.unit.id, soldier3);
    this.moving_units.push(soldier3);
    for (let i = 0; i < 1000; i += 100){
      for (let j = 0; j < 1000; j += 100){
        //console.log("i:", i);
        //console.log("j:", j);
        let x: Soldier = new Soldier(i,j);
        x.give_target(1000-j-i,1000-j-i);
        this.units.set(x.unit.id, x);
        this.moving_units.push(x);
      }
    }


  }
*/
  private debug_print() {
    console.log(this.gameState.players);
  }

  public run() {
    this.debug_print();
    this.eventHandler.startConnection();
    this.draw(0);
  }

  public draw(t: number) {
    //console.log(this.canvas);
    this.gameState.update();
    this.gameState.players.forEach((player) => {
      //console.log(player);
      this.displayDriver.draw(
        this.gameState.players,
        this.gameState.currentPlayerId,
      );
    });
    window.requestAnimationFrame((t) => {
      this.draw(t);
    });
  }
}

const game = new Game();
/*console.log("TAN2: ", Math.atan2(900,900));
console.log("TAN1: ", Math.atan(900/900));
console.log("x speed: ", Math.atan(100/900)/(Math.PI/2));
console.log("y speed: ", 1-Math.atan(100/900)/(Math.PI/2));


 */

game.run();
