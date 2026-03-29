import { Unit } from "./units.js";
import { DisplayDriver } from "./display-driver.js";
export declare class Game {
    displayDriver: DisplayDriver;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    Units: Unit[];
    constructor();
    buildGame(): void;
    run(): void;
    private draw;
}
//# sourceMappingURL=client.d.ts.map