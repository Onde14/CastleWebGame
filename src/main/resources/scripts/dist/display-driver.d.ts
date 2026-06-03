import { GameObject } from "./objects.js";
export declare class DisplayDriver {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gameWidth: number;
    gameHeight: number;
    renderWidthPositionRatio: number;
    renderHeightPositionRatio: number;
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameWidth: number, gameHeight: number);
    resize(): void;
    draw(gameObjects: Map<number, GameObject>, currentplayerColor: string): void;
}
//# sourceMappingURL=display-driver.d.ts.map