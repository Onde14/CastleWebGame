import { Gamestate } from "./gamestate.js";
import type { Controls } from "./controls.js";
import type { DisplayDriver } from "./display-driver.js";
import { MessageHandler } from "./messagehandling.js";
export declare class EventHandler {
    canvas: HTMLCanvasElement;
    gameState: Gamestate;
    controls: Controls;
    displayDriver: DisplayDriver;
    messageHandler?: MessageHandler;
    constructor(canvas: HTMLCanvasElement, gameState: Gamestate, controls: Controls, displayDriver: DisplayDriver);
    mouse_down(e: MouseEvent): void;
    mouse_move(e: MouseEvent): void;
    startConnection(): void;
    event_handling(): void;
    buildGameState(currentPlayerId: number, players: any): void;
    attackOrder(soldiers: any): void;
}
//# sourceMappingURL=events.d.ts.map