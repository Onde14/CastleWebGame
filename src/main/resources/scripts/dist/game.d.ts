import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
import { Controls } from "./controls.js";
import { Gamestate } from "./gamestate.js";
import { EventHandler } from "./events.js";
export declare class Game {
    gameWidth: number;
    gameHeight: number;
    displayDriver: DisplayDriver;
    gameState: Gamestate;
    controls: Controls;
    eventHandler: EventHandler;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor();
    found_goal(pos: Vector, target: Vector): boolean;
    private debug_print;
    run(): void;
    draw(t: number): Promise<void>;
}
//# sourceMappingURL=game.d.ts.map