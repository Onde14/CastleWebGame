import { Gamestate } from "./gamestate.js";
import type { Controls } from "./controls.js";
import type { DisplayDriver } from "./display-driver.js";
import { WebSocketDriver } from "./websocket.js";
export declare class EventHandler {
    canvas: HTMLCanvasElement;
    gameState: Gamestate;
    controls: Controls;
    displayDriver: DisplayDriver;
    webSocketDriver: WebSocketDriver;
    constructor(canvas: HTMLCanvasElement, gameState: Gamestate, controls: Controls, displayDriver: DisplayDriver, webSocketDriver: WebSocketDriver);
    mouse_down(e: MouseEvent): void;
    mouse_move(e: MouseEvent): void;
    event_handling(): void;
}
//# sourceMappingURL=events.d.ts.map