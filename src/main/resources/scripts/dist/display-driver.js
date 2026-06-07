import { Soldier, Castle, GameObject } from "./objects.js";
import { SoldierConfig, CastleConfig } from "./config.js";
import { Player } from "./gamestate.js";
export class DisplayDriver {
    canvas;
    ctx;
    gameWidth;
    gameHeight;
    renderWidthPositionRatio;
    renderHeightPositionRatio;
    constructor(canvas, ctx, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.renderWidthPositionRatio = this.canvas.width / this.gameWidth;
        this.renderHeightPositionRatio = this.canvas.height / this.gameHeight;
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.renderWidthPositionRatio = this.canvas.width / this.gameWidth;
        this.renderHeightPositionRatio = this.canvas.height / this.gameHeight;
    }
    draw(gameObjects, currentplayerColor) {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.gameWidth * this.renderWidthPositionRatio, this.gameHeight * this.renderHeightPositionRatio);
        //console.log("HEIGHT WINDOW RATIO: ", this.renderWidthPositionRatio);
        //console.log("WIDTH WINDOW RATIO: ", this.renderHeightPositionRatio);
        /*this.ctx.fillStyle = "brown";
        this.ctx.fillRect(this.gameWidth / 2 - 5, 75, 10, this.gameHeight - 175);
        this.ctx.save();
        this.ctx.restore();*/
        this.ctx.font = "48px serif";
        this.ctx.fillStyle = currentplayerColor;
        this.ctx.fillText(currentplayerColor, 50, 50);
        let castles = Array();
        let soldiers = Array();
        gameObjects.forEach((gameObject, key) => {
            if (gameObject instanceof Soldier) {
                soldiers.push(gameObject);
            }
            if (gameObject instanceof Castle) {
                castles.push(gameObject);
            }
        });
        soldiers.forEach((unit) => {
            this.ctx.beginPath();
            this.ctx.arc((unit.pos.x * this.renderWidthPositionRatio), (unit.pos.y * this.renderHeightPositionRatio), SoldierConfig.radius, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fillStyle = SoldierConfig.color;
            this.ctx.fill();
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc((unit.pos.x * this.renderWidthPositionRatio), (unit.pos.y * this.renderHeightPositionRatio), SoldierConfig.ownerColorRadius, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fillStyle = unit.ownerColor;
            this.ctx.fill();
            this.ctx.save();
            this.ctx.restore();
        });
        castles.forEach((castle) => {
            if (castle.selected) {
                this.ctx.fillStyle = "white";
                this.ctx.fillRect((castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.width / 2 - 2, (castle.pos.y * this.renderHeightPositionRatio) - CastleConfig.height / 2 - 2, castle.width + 4, castle.height + 4);
                this.ctx.save();
            }
            if (castle.highlighted) {
                //console.log("DEBUG CASTLE POS " + castle.pos.x + ", " + castle.pos.y);
                this.ctx.fillStyle = "red";
                this.ctx.fillRect((castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.width / 2 - CastleConfig.width * 0.04, (castle.pos.y * this.renderHeightPositionRatio) - CastleConfig.height / 2 - CastleConfig.height * 0.04, castle.width + CastleConfig.width * 0.08, castle.height + CastleConfig.height * 0.08);
                this.ctx.save();
            }
            this.ctx.fillStyle = CastleConfig.color;
            //console.log("GAME WIDTH: ", this.gameWidth,"WIDTH POS: ", castle.pos.x, "CASTLE WIDTH: ", CastleConfig.width,"RATIO: ", this.renderWidthPositionRatio, "WIDTH CALC: ",(castle.pos.x - CastleConfig.width / 2) * this.renderWidthPositionRatio)
            this.ctx.fillRect((castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.width / 2, (castle.pos.y * this.renderHeightPositionRatio) - CastleConfig.height / 2, castle.width, castle.height);
            this.ctx.save();
            //console.log("GAME WIDTH: ", this.gameWidth,"WIDTH POS: ", castle.pos.x, "CASTLE WIDTH: ", CastleConfig.ownerColorWidth,"RATIO: ", this.renderWidthPositionRatio, "WIDTH CALC: ",(castle.pos.x - CastleConfig.ownerColorWidth / 2) * this.renderWidthPositionRatio)
            this.ctx.fillStyle = castle.ownerColor;
            this.ctx.fillRect((castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.ownerColorWidth / 2, (castle.pos.y * this.renderHeightPositionRatio) - CastleConfig.ownerColorHeight / 2, CastleConfig.ownerColorWidth, CastleConfig.ownerColorHeight);
            this.ctx.save();
            this.ctx.restore();
        });
    }
}
//# sourceMappingURL=display-driver.js.map