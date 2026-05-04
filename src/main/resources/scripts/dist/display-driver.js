import { Soldier, Castle } from "./objects.js";
import { SoldierConfig, CastleConfig } from "./config.js";
import { Player } from "./gamestate.js";
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
    draw(players, currentplayerId) {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(this.gameWidth / 2 - 5, 75, 10, this.gameHeight - 175);
        this.ctx.save();
        this.ctx.restore();
        players.forEach((player) => {
            if (player.id == currentplayerId) {
                this.ctx.font = "48px serif";
                this.ctx.fillStyle = player.color;
                this.ctx.fillText(player.color, 50, 50);
            }
            player.units.forEach((unit) => {
                this.ctx.beginPath();
                this.ctx.arc(unit.pos.x, unit.pos.y, SoldierConfig.radius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fillStyle = SoldierConfig.color;
                this.ctx.fill();
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(unit.pos.x, unit.pos.y, SoldierConfig.ownerColorRadius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fillStyle = unit.ownerColor;
                this.ctx.fill();
                this.ctx.save();
                this.ctx.restore();
            });
            player.castles.forEach((castle) => {
                if (castle.selected) {
                    this.ctx.fillStyle = "white";
                    this.ctx.fillRect(castle.pos.x - CastleConfig.width / 2 - 2, castle.pos.y / 2 - 2, castle.width + 4, castle.height + 4);
                    this.ctx.save();
                }
                if (castle.highlighted) {
                    this.ctx.fillStyle = "red";
                    this.ctx.fillRect(castle.pos.x - CastleConfig.width / 2 - 2, castle.pos.y / 2 - 2, castle.width + 4, castle.height + 4);
                    this.ctx.save();
                }
                this.ctx.fillStyle = CastleConfig.color;
                this.ctx.fillRect(castle.pos.x - CastleConfig.width / 2, castle.pos.y - CastleConfig.height / 2, castle.width, castle.height);
                this.ctx.save();
                this.ctx.fillStyle = castle.ownerColor;
                this.ctx.fillRect(castle.pos.x - CastleConfig.ownerColorWidth / 2, castle.pos.y - CastleConfig.ownerColorHeight / 2, CastleConfig.ownerColorWidth, CastleConfig.ownerColorHeight);
                this.ctx.save();
                this.ctx.restore();
            });
        });
    }
}
//# sourceMappingURL=display-driver.js.map