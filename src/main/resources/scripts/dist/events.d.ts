import { Gamestate } from "./gamestate.js";
import type { Controls } from "./controls.js";
import type { DisplayDriver } from "./display-driver.js";
import { MessageHandler } from "./messagehandling.js";
import { UserInterface } from "./ui.js";
export declare class EventHandler {
    canvas: HTMLCanvasElement;
    gameState: Gamestate;
    controls: Controls;
    displayDriver: DisplayDriver;
    messageHandler: MessageHandler;
    ui: UserInterface;
    socketOpen: boolean;
    username: string;
    constructor(canvas: HTMLCanvasElement, gameState: Gamestate, controls: Controls, displayDriver: DisplayDriver, ui: UserInterface);
    curlLogin(): Promise<void>;
    mouseDown(e: MouseEvent): void;
    mouseMove(e: MouseEvent): void;
    keyDown(e: KeyboardEvent): void;
    startConnection(): void;
    closeConnection(): void;
    eventHandling(): void;
    buildGameStateEvent(players: any): void;
    responseAttackOrder(soldiers: any, money: number): void;
    updateGameStateEvent(updates: any, tick: number): void;
    setCurrentPlayerId(clientId: string): void;
    gameEnd(winner: string): void;
    sendTick(): void;
    CPUcreateUnit(state: number, money: number, soldiers: any): void;
}
//# sourceMappingURL=events.d.ts.map