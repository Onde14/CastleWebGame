import { Soldier } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
export declare class Game {
    displayDriver: DisplayDriver;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    units: Map<number, Soldier>;
    moving_units: Soldier[];
    i: number;
    constructor();
    road_build(start: Vector, end: Vector): void;
    private init_event_listeners;
    private build_game;
    found_goal(pos: Vector, target: Vector): boolean;
    debug_give_move_command(): void;
    move_commands(): void;
    run(): void;
    draw(t: number): void;
}
//# sourceMappingURL=game.d.ts.map