import { Soldier, Castle, GameObject } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
export declare class Player {
    id: number;
    ai: boolean;
    units: Array<Soldier>;
    castles: Array<Castle>;
    color: string;
    constructor(ai: boolean, id: number, units: Array<Soldier>, castles: Array<Castle>, color: string);
}
export declare class Gamestate {
    displayDriver: DisplayDriver;
    players: Player[];
    gameObjects: Map<number, GameObject>;
    currentPlayerId: number;
    constructor(displayDriver: DisplayDriver, currentPlayerId: number);
    buildGameState(currentPlayerId: number, players: any): void;
    create_soldiers(soldiers: any): void;
    update(updates: any): void;
    private move_commands;
}
//# sourceMappingURL=gamestate.d.ts.map