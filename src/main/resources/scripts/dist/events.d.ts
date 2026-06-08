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
    mouseDown(e: MouseEvent): void;
    mouseMove(e: MouseEvent): void;
    startConnection(): void;
    eventHandling(): void;
    buildGameStateEvent(players: any): void;
    responseAttackOrder(soldiers: any): void;
    updateGameStateEvent(updates: any, tick: number): void;
    setCurrentPlayerId(clientId: string): void;
}
//# sourceMappingURL=events.d.ts.map