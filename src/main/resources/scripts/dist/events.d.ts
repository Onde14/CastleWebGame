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
    buildGameStateEvent(currentPlayerId: number, currentPlayerColor: string, players: any): void;
    attackOrderEvent(soldiers: any): void;
    updateGameStateEvent(updates: any): void;
}
//# sourceMappingURL=events.d.ts.map