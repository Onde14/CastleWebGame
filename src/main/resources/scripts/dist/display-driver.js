import { Soldier } from "./objects.js";
import { SoldierConfig } from "./config.js";
export class DisplayDriver {
    canvas;
    ctx;
    gameWidth;
    gameHeight;
    constructor(canvas, ctx, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    initdraw() {
    }
    draw(units) {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(this.gameWidth / 2 - 25, 50, 50, 50);
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(this.gameWidth / 2 - 25, this.gameHeight - 100, 50, 50);
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(this.gameWidth / 2 - 5, 100, 10, this.gameHeight - 200);
        this.ctx.save();
        this.ctx.restore();
        units.forEach((unit, key) => {
            this.ctx.beginPath();
            this.ctx.arc(unit.unit.pos.x, unit.unit.pos.y, 15, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fillStyle = SoldierConfig.color;
            this.ctx.fill();
            this.ctx.save();
            this.ctx.restore();
        });
    }
    update(units) {
        units.forEach((value, key) => {
        });
    }
}
//# sourceMappingURL=display-driver.js.map