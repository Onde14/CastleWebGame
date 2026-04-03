import { Soldier } from "./objects.js"
import { SoldierConfig} from "./config.js";

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

    public initdraw(){



    }

    public draw(units: Map<number,Soldier>){
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(this.gameWidth/2-25, 50, 50, 50);

        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(this.gameWidth/2-25, this.gameHeight-100, 50, 50);

        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(this.gameWidth/2-5, 100, 10, this.gameHeight-200);
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

    public update(units: Map<string, Soldier>) {
        units.forEach((value, key) => {

        });
    }
}