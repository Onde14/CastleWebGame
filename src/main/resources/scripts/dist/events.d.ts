import { Gamestate } from "./gamestate.js";
import type { Controls } from "./controls.js";
import type { DisplayDriver } from "./display-driver.js";
export declare class EventHandler {
    canvas: HTMLCanvasElement;
    gameState: Gamestate;
    controls: Controls;
    displayDriver: DisplayDriver;
    constructor(canvas: HTMLCanvasElement, gameState: Gamestate, controls: Controls, displayDriver: DisplayDriver);
    mouse_down(e: MouseEvent): void;
    mouse_move(e: MouseEvent): void;
    event_handling(): void;
}
//# sourceMappingURL=events.d.ts.map