import { Unit } from "./units.js";
import { DisplayDriver } from "./display-driver.js";
let message = "Hello World!";
console.log(message);
var WINDOW;
(function (WINDOW) {
    WINDOW[WINDOW["WIDTH"] = 500] = "WIDTH";
    WINDOW[WINDOW["HEIGHT"] = 500] = "HEIGHT";
})(WINDOW || (WINDOW = {}));
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
export class Game {
    displayDriver;
    canvas;
    ctx;
    Units = [];
    constructor() {
        this.displayDriver = new DisplayDriver();
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
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
    run() {
        this.draw(0);
    }
    draw(tick) {
        let next = tick + 1;
        requestAnimationFrame(this.draw);
    }
}
const game = new Game();
game.buildGame();
game.run();
//# sourceMappingURL=client.js.map