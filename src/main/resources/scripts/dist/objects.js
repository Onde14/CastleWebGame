import { CastleConfig, SoldierConfig } from "./config.js";
import { Vector } from "./vector.js";
class Object {
}
class Structure {
    id;
    type;
    pos;
    width;
    height;
    constructor(type, posx, posy, width, height) {
        this.id = Math.random();
        this.type = type;
        this.pos = new Vector(posx, posy);
        this.width = width;
        this.height = height;
    }
}
class Unit {
    id;
    type;
    pos;
    width;
    height;
    target;
    is_moving = false;
    constructor(type, posx, posy, width, height) {
        this.id = Math.random();
        this.type = type;
        this.pos = new Vector(posx, posy);
        this.width = width;
        this.height = height;
        this.target = new Vector(0, 0);
    }
}
export class Castle {
    structure;
    selected = false;
    owner;
    ownerColor;
    constructor(posx, posy, owner, ownerColor) {
        this.structure = new Structure("castle", posx, posy, CastleConfig.width, CastleConfig.height);
        this.owner = owner;
        this.ownerColor = ownerColor;
    }
    is_selected() {
        return this.selected;
    }
    set_selected(b) {
        this.selected = b;
    }
}
export class Road {
    structure;
    selected = false;
    constructor(posx, posy) {
        this.structure = new Structure("road", posx, posy, CastleConfig.width, CastleConfig.height);
    }
}
export class Soldier {
    unit;
    selected = false;
    owner;
    ownerColor;
    constructor(posx, posy, owner, ownerColor) {
        this.unit = new Unit("soldier", posx, posy, SoldierConfig.width, SoldierConfig.height);
        this.owner = owner;
        this.ownerColor = ownerColor;
    }
    is_selected() {
        return this.selected;
    }
    select(b) {
        this.selected = b;
    }
    give_target(x, y) {
        this.unit.target.x = x;
        this.unit.target.y = y;
        this.unit.is_moving = true;
    }
    move_to_target() {
        let newX = this.unit.pos.x;
        let newY = this.unit.pos.y;
        let ratio = (Math.abs(this.unit.target.x - this.unit.pos.x) / Math.abs(this.unit.target.y - this.unit.pos.y));
        let movementMul = 1;
        let xMovementSpeed = movementMul * (ratio / (ratio + 1));
        let yMovementSpeed = movementMul * (1 / (ratio + 1));
        if (this.unit.pos.x > this.unit.target.x) {
            newX = this.unit.pos.x - xMovementSpeed;
        }
        else if (this.unit.pos.x < this.unit.target.x) {
            newX = this.unit.pos.x + xMovementSpeed;
        }
        if (this.unit.pos.y > this.unit.target.y) {
            newY = this.unit.pos.y - yMovementSpeed;
        }
        else if (this.unit.pos.y < this.unit.target.y) {
            newY = this.unit.pos.y + yMovementSpeed;
        }
        console.log("this.unit.target.x = ", this.unit.target.x);
        console.log("this.unit.pos.x = ", this.unit.pos.x);
        console.log("this.unit.target.y = ", this.unit.target.y);
        console.log("this.unit.pos.y = ", this.unit.pos.y);
        console.log("RATIO = ", ratio);
        console.log("newX = ", newX);
        console.log("xMovementSpeed = ", xMovementSpeed);
        console.log("newY = ", newY);
        console.log("yMovementSpeed = ", yMovementSpeed);
        console.log("negate: ", newX - newY);
        return new Vector(newX, newY);
    }
    has_found_target() {
        if (Math.abs(this.unit.pos.x - this.unit.target.x) < 0.5 && Math.abs(this.unit.pos.y - this.unit.target.y) < 0.5) {
            this.unit.is_moving = false;
            return true;
        }
        else {
            return false;
        }
    }
}
//# sourceMappingURL=objects.js.map