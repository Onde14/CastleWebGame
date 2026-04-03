import { Soldier, Castle, Road } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { RoadSize } from "./config.js";
let message = "Hello World!";
console.log(message);
const canvas = document.getElementById("canvas");
const canvas_width = canvas.width;
const canvas_height = canvas.height;
const ctx = canvas.getContext("2d");
const canvas_cwidth = canvas.clientWidth;
const canvas_cheight = canvas.clientHeight;
console.log("PW: ", canvas_width, ", CW: ", canvas_cwidth);
console.log("PH: ", canvas_height, ", CH ", canvas_cheight);
export class Game {
    displayDriver;
    canvas;
    ctx;
    units = new Map();
    i;
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.displayDriver = new DisplayDriver(this.canvas, this.ctx, this.canvas.width, this.canvas.height);
        this.init_event_listeners(canvas);
        this.displayDriver.resize();
        console.log("Game built");
        this.i = 0;
        this.build_game();
    }
    road_build(start, end) {
        let road_height = Math.hypot((end.x - start.x), (end.y - start.y));
        let road_rotation = Math.atan2((end.y - start.y), (end.x - start.x));
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(start.x, start.y, RoadSize.width, road_height);
    }
    init_event_listeners(canvas) {
        canvas.addEventListener("mousedown", function (e) {
            let rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            console.log("Coordinate x: " + x, "Coordinate y: " + y);
        });
        window.addEventListener("resize", () => {
            this.displayDriver.resize();
        });
    }
    build_game() {
        let soldier = new Soldier(500, 500);
        this.units.set(soldier.unit.id, soldier);
    }
    move_commands() {
        this.units.forEach((unit, key) => {
            let target = new Vector(0, 600);
            console.log("Moving Unit", unit.unit.id, " from [", unit.unit.pos.x, ",", unit.unit.pos.y, "] to [", target.x, ",", target.y, "]");
            let order = unit.move_to_target(target);
            unit.unit.pos.x = order.x;
            unit.unit.pos.y = order.y;
        });
    }
    run() {
        this.draw(0);
    }
    draw(t) {
        //console.log(this.canvas);
        this.move_commands();
        this.displayDriver.draw(this.units);
        window.requestAnimationFrame(t => {
            this.draw(t);
        });
    }
}
const game = new Game();
console.log(game.canvas);
game.run();
//# sourceMappingURL=game.js.map