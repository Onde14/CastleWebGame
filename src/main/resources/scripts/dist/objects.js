import { CastleSize, SoldierSize } from "./config.js";
import { Vector } from "./vector.js";
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
    constructor(type, posx, posy, width, height) {
        this.id = Math.random();
        this.type = type;
        this.pos = new Vector(posx, posy);
        this.width = width;
        this.height = height;
    }
}
export class Castle {
    structure;
    selected = false;
    constructor(structure, posx, posy) {
        this.structure = new Structure("castle", posx, posy, CastleSize.width, CastleSize.height);
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
        this.structure = new Structure("road", posx, posy, CastleSize.width, CastleSize.height);
    }
}
export class Soldier {
    unit;
    selected = false;
    constructor(posx, posy) {
        this.unit = new Unit("soldier", posx, posy, SoldierSize.width, SoldierSize.height);
    }
    is_selected() {
        return this.selected;
    }
    set_selected(b) {
        this.selected = b;
    }
}
//# sourceMappingURL=objects.js.map