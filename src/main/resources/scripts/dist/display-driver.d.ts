import { Soldier } from "./objects.js";
export declare class DisplayDriver {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gameWidth: number;
    gameHeight: number;
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameWidth: number, gameHeight: number);
    resize(): void;
    initdraw(): void;
    draw(units: Map<number, Soldier>): void;
    update(units: Map<string, Soldier>): void;
}
//# sourceMappingURL=display-driver.d.ts.map