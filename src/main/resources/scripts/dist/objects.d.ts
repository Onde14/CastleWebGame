import { Vector } from "./vector.js";
declare class GameObject {
    movable: boolean;
    selectable: boolean;
    constructor(movable: boolean, selectable: boolean);
}
declare class Structure extends GameObject {
    id: number;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    constructor(selectable: boolean, type: string, pos: Vector, width: number, height: number);
}
declare class Unit extends GameObject {
    id: number;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    target: Vector;
    moving: boolean;
    constructor(movable: boolean, type: string, pos: Vector, width: number, height: number);
}
export declare class Castle extends Structure {
    selected: boolean;
    targeted: boolean;
    owner: number;
    ownerColor: string;
    highlighted: boolean;
    constructor(pos: Vector, owner: number, ownerColor: string);
}
export declare class Road extends Structure {
    selected: boolean;
    constructor(pos: Vector, height: number);
}
export declare class Soldier extends Unit {
    owner: number;
    ownerColor: string;
    constructor(pos: Vector, owner: number, ownerColor: string);
    give_target(target: Vector): void;
    move_to_target(): void;
    has_found_target(): boolean;
}
export {};
//# sourceMappingURL=objects.d.ts.map