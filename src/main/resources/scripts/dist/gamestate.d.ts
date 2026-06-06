import { Soldier, Castle, GameObject } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
export declare class Player {
    id: string;
    ai: boolean;
    units: Array<Soldier>;
    castles: Array<Castle>;
    color: string;
    constructor(ai: boolean, id: string, units: Array<Soldier>, castles: Array<Castle>, color: string);
}
export declare class Gamestate {
    displayDriver: DisplayDriver;
    players: Player[];
    gameObjects: Map<string, GameObject>;
    currentPlayerId: string;
    currentPlayerColor: string;
    constructor(displayDriver: DisplayDriver);
    setCurrentPlayerId(clientId: string): void;
    buildGameState(players: any): void;
    create_soldiers(soldiers: any): void;
    update(updates: any): void;
    private move_commands;
}
//# sourceMappingURL=gamestate.d.ts.map