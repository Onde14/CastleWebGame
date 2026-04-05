import { Soldier } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
export declare class Game {
    gameWidth: number;
    gameHeight: number;
    displayDriver: DisplayDriver;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    units: Map<number, Soldier>;
    moving_units: Soldier[];
    constructor();
    road_build(start: Vector, end: Vector): void;
    init_event_listeners(canvas: HTMLCanvasElement, units: Map<number, Soldier>): void;
    private build_game;
    found_goal(pos: Vector, target: Vector): boolean;
    debug_give_move_command(): void;
    move_commands(): void;
    run(): void;
    draw(t: number): void;
}
//# sourceMappingURL=game.d.ts.map