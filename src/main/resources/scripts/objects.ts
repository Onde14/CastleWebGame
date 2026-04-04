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
    target: Vector;
    is_moving = false;

    constructor(type: string, posx: number, posy: number, width: number, height: number) {
        this.id = Math.random();
        this.type = type;
        this.pos = new Vector(posx,posy);
        this.width = width;
        this.height = height;
        this.target = new Vector(0,0);
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

    public give_target(x: number, y: number){
        this.unit.target.x = x;
        this.unit.target.y = y;
        this.unit.is_moving = true;
    }

    public move_to_target(){
        let newX = this.unit.pos.x;
        let newY = this.unit.pos.y;
        let ratio = Math.abs(this.unit.target.x-this.unit.pos.x)/Math.abs(this.unit.target.y-this.unit.pos.y);
        let baseMovement = 2;
        let xMovementSpeed = Math.atan(ratio)/(Math.PI/2);
        let yMovementSpeed = 1-xMovementSpeed;
        if (this.unit.pos.x > this.unit.target.x){
            newX = this.unit.pos.x-xMovementSpeed;
        } else if (this.unit.pos.x < this.unit.target.x){
            newX = this.unit.pos.x+xMovementSpeed;
        }
        if (this.unit.pos.y > this.unit.target.y){
            newY = this.unit.pos.y-yMovementSpeed;
        } else if (this.unit.pos.y < this.unit.target.y){

            newY = this.unit.pos.y+yMovementSpeed;
        }
        /*console.log("RATIO = ", ratio);
        console.log("newX = ", newX);
        console.log("xMovementSpeed = ", xMovementSpeed);
        console.log("newY = ", newY);
        console.log("yMovementSpeed = ", yMovementSpeed);

         */
        return new Vector(newX,newY);
    }

    public has_found_target(){
        if (Math.abs(this.unit.pos.x-this.unit.target.x) < 0.5 && Math.abs(this.unit.pos.y-this.unit.target.y) < 0.5){
            this.unit.is_moving = false;
            return true;
        } else {
            return false;
        }
    }

}
