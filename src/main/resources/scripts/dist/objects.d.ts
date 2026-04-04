import { Vector } from "./vector.js";
declare class Structure {
    id: number;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    constructor(type: string, posx: number, posy: number, width: number, height: number);
}
declare class Unit {
    id: number;
    type: string;
    pos: Vector;
    width: number;
    height: number;
    target: Vector;
    is_moving: boolean;
    constructor(type: string, posx: number, posy: number, width: number, height: number);
}
export declare class Castle {
    structure: Structure;
    selected: boolean;
    constructor(structure: Structure, posx: number, posy: number);
    is_selected(): boolean;
    set_selected(b: boolean): void;
}
export declare class Road {
    structure: Structure;
    selected: boolean;
    constructor(posx: number, posy: number);
}
export declare class Soldier {
    unit: Unit;
    selected: boolean;
    constructor(posx: number, posy: number);
    is_selected(): boolean;
    select(b: boolean): void;
    give_target(x: number, y: number): void;
    move_to_target(): Vector;
    has_found_target(): boolean;
}
export {};
//# sourceMappingURL=objects.d.ts.map