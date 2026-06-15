import { Castle } from "./objects.js";
import { Gamestate } from "./gamestate.js";
import type { Vector } from "./vector.js";
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
    connections: Map<Castle, Castle>;
    connectionsCreated: boolean;
    constructor(ui: UserInterface, gameState: Gamestate, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameWidth: number, gameHeight: number);
    resize(): void;
    createConnections(): void;
    drawTitle(): void;
    roadBuild(start: Vector, end: Vector): void;
    drawRoads(): void;
    drawPointer(): void;
    drawGameClock(): void;
    drawGame(): void;
    drawMatchmakingText(): void;
    drawMenu(): void;
    drawMatchmaking(): void;
    drawCurrPlayerDefeated(): void;
    drawEndGame(): void;
    draw(): void;
}
//# sourceMappingURL=display-driver.d.ts.map