import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { Controls } from "./controls.js";
import { Gamestate, Player } from "./gamestate.js";
import { EventHandler } from "./events.js";
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
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export class Game {
    gameWidth;
    gameHeight;
    displayDriver;
    gameState;
    controls;
    eventHandler;
    canvas;
    ctx;
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        this.displayDriver = new DisplayDriver(this.canvas, this.ctx, this.gameWidth, this.gameHeight);
        this.displayDriver.resize();
        this.gameState = new Gamestate(this.displayDriver, 0);
        this.controls = new Controls();
        console.log("Game built");
        this.eventHandler = new EventHandler(this.canvas, this.gameState, this.controls, this.displayDriver);
        this.eventHandler.event_handling();
    }
    found_goal(pos, target) {
        return Math.abs(pos.x - target.x) < 0.5 && Math.abs(pos.y - target.y) < 0.5;
    }
    debug_print() {
        console.log(this.gameState.players);
    }
    run() {
        this.debug_print();
        this.eventHandler.startConnection();
        this.draw(0);
    }
    async draw(t) {
        //console.log(this.canvas);
        this.gameState.players.forEach((player) => {
            //console.log(player);
            this.displayDriver.draw(this.gameState.players, this.gameState.currentPlayerId);
        });
        await sleep(16);
        window.requestAnimationFrame((t) => {
            this.draw(t);
        });
    }
}
const game = new Game();
game.run();
//# sourceMappingURL=game.js.map