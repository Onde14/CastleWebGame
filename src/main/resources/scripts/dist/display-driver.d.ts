import { Gamestate } from "./gamestate.js";
import { type UserInterface } from "./ui.js";
export declare class DisplayDriver {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gameState: Gamestate;
    gameWidth: number;
    gameHeight: number;
    renderWidthPositionRatio: number;
    renderHeightPositionRatio: number;
    ui: UserInterface;
    constructor(ui: UserInterface, gameState: Gamestate, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameWidth: number, gameHeight: number);
    resize(): void;
    drawGame(): void;
    drawMenu(): void;
    draw(): void;
}
//# sourceMappingURL=display-driver.d.ts.map