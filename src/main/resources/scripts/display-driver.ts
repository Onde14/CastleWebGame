import { Soldier, Castle } from "./objects.js"
import { SoldierConfig, CastleConfig} from "./config.js";
import { Player } from "./gamestate.js";

export class DisplayDriver {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gameWidth: number;
    gameHeight: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameWidth: number, gameHeight: number) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    public resize(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    public draw(players: Array<Player>){
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(this.gameWidth/2-5, 100, 10, this.gameHeight-200);
        this.ctx.save();
        this.ctx.restore();

        players.forEach(player => {
            player.castles.forEach((castle) => {
                this.ctx.fillStyle = CastleConfig.color;
                this.ctx.fillRect(castle.structure.pos.x-CastleConfig.width/2, castle.structure.pos.y, castle.structure.width, castle.structure.height);
                this.ctx.save();

                this.ctx.fillStyle = castle.ownerColor;
                this.ctx.fillRect(castle.structure.pos.x-CastleConfig.ownerColorWidth/2,
                    castle.structure.pos.y+CastleConfig.ownerColorHeight/2,
                    CastleConfig.ownerColorWidth,
                    CastleConfig.ownerColorHeight);
                this.ctx.save();
                this.ctx.restore();

            });

            player.units.forEach((unit) => {
                this.ctx.beginPath();
                this.ctx.arc(unit.unit.pos.x, unit.unit.pos.y, SoldierConfig.radius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fillStyle = SoldierConfig.color;
                this.ctx.fill();
                this.ctx.save();

                this.ctx.beginPath();
                this.ctx.arc(unit.unit.pos.x, unit.unit.pos.y, SoldierConfig.ownerColorRadius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fillStyle = unit.ownerColor;
                this.ctx.fill();
                this.ctx.save();
                this.ctx.restore();

            });
        });




    }

}