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
    matchmakingDots: number;
    iterator: number;
    constructor(ui: UserInterface, gameState: Gamestate, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameWidth: number, gameHeight: number);
    resize(): void;
    drawPointer(): void;
    drawGameClock(): void;
    drawGame(): void;
    drawMenu(): void;
    drawMatchmaking(): void;
    drawEndGame(): void;
    draw(): void;
}
//# sourceMappingURL=display-driver.d.ts.map