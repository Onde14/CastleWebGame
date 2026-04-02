import { CastleSize, SoldierSize } from "./config.js"
import { Vector } from "./vector.js"

class Structure {
    id: number;
    type: string;
    pos: Vector;
    width: number;
    height: number;


    constructor(type: string, posx: number, posy: number, width: number, height: number) {
        this.id = Math.random();
        this.type = type;
        this.pos = new Vector(posx,posy);
        this.width = width;
        this.height = height;


    }

}

class Unit {
    id: number;
    type: string;
    pos: Vector;
    width: number;
    height: number;

    constructor(type: string, posx: number, posy: number, width: number, height: number) {
        this.id = Math.random();
        this.type = type;
        this.pos = new Vector(posx,posy);
        this.width = width;
        this.height = height;
    }

}

export class Castle {
    structure: Structure;
    selected = false;

    constructor(structure: Structure, posx: number, posy: number) {
        this.structure = new Structure("castle", posx, posy, CastleSize.width, CastleSize.height);
    }

    is_selected(){
        return this.selected;
    }

    set_selected(b: boolean){
        this.selected = b;
    }
}

export class Road {
    structure: Structure;
    selected = false;

    constructor(posx: number, posy: number) {
        this.structure = new Structure("road", posx, posy, CastleSize.width, CastleSize.height);
    }
}


export class Soldier {
    unit: Unit;
    selected = false;
    constructor(posx: number, posy: number) {
        this.unit = new Unit("soldier", posx, posy, SoldierSize.width, SoldierSize.height);
    }
    is_selected(){
        return this.selected;
    }

    set_selected(b: boolean){
        this.selected = b;
    }

}
