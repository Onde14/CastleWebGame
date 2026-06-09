import { DisplayDriver } from "./display-driver.js";
import { Controls } from "./controls.js";
import { Gamestate } from "./gamestate.js";
import { EventHandler } from "./events.js";
import { UserInterface } from "./ui.js";
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export class Game {
    gameWidth;
    gameHeight;
    displayDriver;
    gameState;
    controls;
    ui;
    eventHandler;
    canvas;
    ctx;
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        this.ui = new UserInterface(this.gameWidth, this.gameHeight);
        this.gameState = new Gamestate();
        this.controls = new Controls(this.gameWidth, this.gameHeight, this.gameState, this.ui);
        this.displayDriver = new DisplayDriver(this.ui, this.gameState, this.canvas, this.ctx, this.gameWidth, this.gameHeight);
        this.displayDriver.resize();
        this.eventHandler = new EventHandler(this.canvas, this.gameState, this.controls, this.displayDriver, this.ui);
        this.eventHandler.eventHandling();
    }
    found_goal(pos, target) {
        return Math.abs(pos.x - target.x) < 0.5 && Math.abs(pos.y - target.y) < 0.5;
    }
    debug_print() {
        console.log(this.gameState.players);
    }
    run() {
        this.debug_print();
        this.draw(0);
    }
    draw(t) {
        //console.log(this.canvas);
        //console.log("DRAWING")
        this.displayDriver.draw();
        //console.log((Math.trunc(t % 5000)))
        if (Math.trunc(t % 5000) > 4993) {
            console.log("TICKING:", (Math.trunc(t % 5000) < 4993));
            this.eventHandler.sendTick();
        }
        window.requestAnimationFrame((t) => {
            this.draw(t);
        });
    }
}
const game = new Game();
game.run();
//# sourceMappingURL=game.js.map