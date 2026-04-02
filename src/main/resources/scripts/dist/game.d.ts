import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
export declare class Game {
    displayDriver: DisplayDriver;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    units: never[];
    constructor();
    roadBuild(start: Vector, end: Vector): void;
    buildGame(): void;
}
//# sourceMappingURL=game.d.ts.map