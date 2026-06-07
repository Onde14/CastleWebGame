import { GameObject } from "./objects.js";
import { type UserInterface } from "./ui.js";
export declare class DisplayDriver {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gameWidth: number;
    gameHeight: number;
    renderWidthPositionRatio: number;
    renderHeightPositionRatio: number;
    ui: UserInterface;
    constructor(ui: UserInterface, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameWidth: number, gameHeight: number);
    resize(): void;
    drawGame(gameObjects: Map<string, GameObject>, currentplayerColor: string): void;
    draw(gameObjects: Map<string, GameObject>, currentplayerColor: string): void;
}
//# sourceMappingURL=display-driver.d.ts.map