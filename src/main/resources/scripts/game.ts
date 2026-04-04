import { Soldier, Castle, Road } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { RoadSize } from "./config.js";
import { selecting } from "./controls.js";

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
  displayDriver: DisplayDriver;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  units = new Map<number,Soldier>();
  moving_units = new Array<Soldier>;
  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.displayDriver = new DisplayDriver(this.canvas,this.ctx,this.canvas.width,this.canvas.height);
    this.displayDriver.resize();
    console.log("Game built");
    this.build_game();
    this.init_event_listeners(this.canvas,this.units);
  }

  road_build(start: Vector, end: Vector){
    let road_height = Math.hypot((end.x-start.x),(end.y-start.y));
    let road_rotation = Math.atan2((end.y-start.y),(end.x-start.x));
    this.ctx.fillStyle = "brown";
    this.ctx.fillRect(start.x,start.y,RoadSize.width,road_height);
  }



  init_event_listeners(canvas: HTMLCanvasElement, units: Map<number,Soldier>){
    canvas.addEventListener("mousedown", function (e) {
      let rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      console.log("Coordinate x: " + x, "Coordinate y: " + y);
      if (selecting(x,y,units)){
        console.log("Selected: ", true);
      } else {
        console.log("Selected: ", false);
      }
    });
    window.addEventListener("resize", () => {
      this.displayDriver.resize();
    });
  }

  private build_game(){
    this.debug_give_move_command();
  }

  found_goal(pos: Vector,target: Vector){
    return (Math.abs(pos.x-target.x) < 0.5 && Math.abs(pos.y-target.y) < 0.5);
  }

  debug_give_move_command(){
    let soldier1 = new Soldier(100,100);
    soldier1.give_target(900,900);
    this.units.set(soldier1.unit.id, soldier1);
    this.moving_units.push(soldier1);
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

  public move_commands(){
    this.moving_units.forEach((unit, i) => {
      if (unit.has_found_target()){
        //console.log("Unit", unit.unit.id, " reached target [", unit.unit.pos.x, ",", unit.unit.pos.y,"]");
        delete this.moving_units[i];
      } else {
        //console.log("Moving Unit", unit.unit.id, " from [", unit.unit.pos.x, ",", unit.unit.pos.y, "] to [", unit.unit.target.x, ",", unit.unit.target.y,"]")
        let order = unit.move_to_target();
        unit.unit.pos.x = order.x;
        unit.unit.pos.y = order.y;
      }
    });
  }

  public run() {
    this.draw(0);
  }

  public draw(t: number) {
    //console.log(this.canvas);
    this.move_commands();
    this.displayDriver.draw(this.units);
    window.requestAnimationFrame(t => {
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

