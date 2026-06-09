import { Soldier, Castle, Village, GameObject } from "./objects.js";
import { UserInterface } from "./ui.js";
export declare enum PlayerState {
    Playing = 0,
    Defeated = 1
}
export declare enum GameStatus {
    Started = 0,
    Ended = 1
}
export declare class Player {
    id: string;
    ai: boolean;
    units: Array<Soldier>;
    castles: Array<Castle>;
    villages: Array<Village>;
    color: string;
    state: PlayerState;
    constructor(ai: boolean, id: string, units: Array<Soldier>, castles: Array<Castle>, villages: Array<Village>, color: string);
}
export declare class Gamestate {
    players: Player[];
    gameObjects: Map<string, GameObject>;
    currentPlayerId: string;
    currentPlayer: Player | undefined;
    clock: number;
    winner: Player | null;
    state: GameStatus;
    ui: UserInterface;
    constructor(ui: UserInterface);
    setCurrentPlayerId(clientId: string): void;
    buildGameState(players: any): void;
    createSoldiers(soldiers: any): void;
    update(updates: Array<any>, tick: number): void;
    private move_commands;
    gameEnd(winner: string): void;
    resetGameState(): void;
}
//# sourceMappingURL=gamestate.d.ts.map