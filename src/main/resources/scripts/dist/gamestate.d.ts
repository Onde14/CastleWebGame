import { Soldier, Castle } from "./objects.js";
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
    players: Array<Player>;
    currentPlayerId: number;
    constructor(displayDriver: DisplayDriver, players: Array<Player>, currentPlayerId: number);
    create_soldiers(soldiers: any): void;
    update(updatedPlayers: any): void;
    private move_commands;
}
//# sourceMappingURL=gamestate.d.ts.map