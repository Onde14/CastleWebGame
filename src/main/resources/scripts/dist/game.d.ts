import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { Controls } from "./controls.js";
import { Gamestate } from "./gamestate.js";
import { EventHandler } from "./events.js";
import { WebSocketDriver } from "./websocket.js";
export declare class Game {
    gameWidth: number;
    gameHeight: number;
    displayDriver: DisplayDriver;
    gameState: Gamestate;
    controls: Controls;
    webSocketDriver: WebSocketDriver;
    eventHandler: EventHandler;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor();
    road_build(start: Vector, end: Vector): void;
    found_goal(pos: Vector, target: Vector): boolean;
    private build_game;
    private debug_print;
    run(): void;
    draw(t: number): void;
}
//# sourceMappingURL=game.d.ts.map