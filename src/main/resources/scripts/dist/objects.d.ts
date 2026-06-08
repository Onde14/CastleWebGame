import { Vector } from "./vector.js";
export declare class GameObject {
    movable: boolean;
    selectable: boolean;
    health: number;
    constructor(movable: boolean, selectable: boolean, health: number);
}
declare class Structure extends GameObject {
    id: string;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    constructor(selectable: boolean, type: string, pos: Vector, width: number, height: number, id: string, health: number);
}
declare class Unit extends GameObject {
    id: string;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    target: Vector;
    moving: boolean;
    constructor(movable: boolean, id: string, type: string, pos: Vector, width: number, height: number, health: number);
}
export declare class Castle extends Structure {
    selected: boolean;
    targeted: boolean;
    owner: string;
    ownerColor: string;
    highlighted: boolean;
    villages: Array<Village>;
    constructor(pos: Vector, id: string, owner: string, ownerColor: string, health: number, villages: Array<Village>);
}
export declare class Village extends Structure {
    owner: string;
    constructor(pos: Vector, id: string, owner: string, health: number);
}
export declare class Soldier extends Unit {
    owner: string;
    ownerColor: string;
    constructor(pos: Vector, id: string, owner: string, ownerColor: string, health: number);
    give_target(target: Vector): void;
    move_to_target(): void;
    has_found_target(): boolean;
}
export {};
//# sourceMappingURL=objects.d.ts.map