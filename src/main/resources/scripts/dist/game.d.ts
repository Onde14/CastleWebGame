import { Soldier } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
export declare class Game {
    displayDriver: DisplayDriver;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    units: Map<number, Soldier>;
    i: number;
    constructor();
    road_build(start: Vector, end: Vector): void;
    private init_event_listeners;
    private build_game;
    move_commands(): void;
    run(): void;
    draw(t: number): void;
}
//# sourceMappingURL=game.d.ts.map