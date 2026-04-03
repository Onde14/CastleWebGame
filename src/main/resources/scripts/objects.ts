import { CastleSize, SoldierConfig } from "./config.js"
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
        this.unit = new Unit("soldier", posx, posy, SoldierConfig.width, SoldierConfig.height);
    }
    public is_selected(){
        return this.selected;
    }

    public set_selected(b: boolean){
        this.selected = b;
    }

    public move_to_target(target: Vector){
        let x = this.unit.pos.x;
        let y = this.unit.pos.y;
        console.log(0);
        if (this.unit.pos.x > target.x){
            console.log(1);
            x = this.unit.pos.x-1;
        } else if (this.unit.pos.x < target.x){
            console.log(2);

            x = this.unit.pos.x+1;
        }
        if (this.unit.pos.y > target.y){
            console.log(3);

            y = this.unit.pos.y-1;
        } else if (this.unit.pos.y < target.y){
            console.log(4);

            y = this.unit.pos.y+1;
        }
        return new Vector(x,y);
    }

}
