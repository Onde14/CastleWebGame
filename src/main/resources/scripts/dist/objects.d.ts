import { Vector } from "./vector.js";
export declare class GameObject {
    movable: boolean;
    selectable: boolean;
    constructor(movable: boolean, selectable: boolean);
}
declare class Structure extends GameObject {
    id: string;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    constructor(selectable: boolean, type: string, pos: Vector, width: number, height: number, id: string);
}
declare class Unit extends GameObject {
    id: string;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    target: Vector;
    moving: boolean;
    constructor(movable: boolean, id: string, type: string, pos: Vector, width: number, height: number);
}
export declare class Castle extends Structure {
    selected: boolean;
    targeted: boolean;
    owner: string;
    ownerColor: string;
    highlighted: boolean;
    constructor(pos: Vector, id: string, owner: string, ownerColor: string);
}
export declare class Soldier extends Unit {
    owner: string;
    ownerColor: string;
    constructor(pos: Vector, id: string, owner: string, ownerColor: string);
    give_target(target: Vector): void;
    move_to_target(): void;
    has_found_target(): boolean;
}
export {};
//# sourceMappingURL=objects.d.ts.map