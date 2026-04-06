import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { Gamestate } from "./gamestate.js";
export declare class Game {
    gameWidth: number;
    gameHeight: number;
    displayDriver: DisplayDriver;
    gameState: Gamestate;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor();
    road_build(start: Vector, end: Vector): void;
    init_event_listeners(canvas: HTMLCanvasElement, gameState: Gamestate): void;
    found_goal(pos: Vector, target: Vector): boolean;
    private build_game;
    private debug_print;
    run(): void;
    draw(t: number): void;
}
//# sourceMappingURL=game.d.ts.map