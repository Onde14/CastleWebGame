import { CastleSize, SoldierConfig } from "./config.js";
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
        this.unit = new Unit("soldier", posx, posy, SoldierConfig.width, SoldierConfig.height);
    }
    is_selected() {
        return this.selected;
    }
    set_selected(b) {
        this.selected = b;
    }
    move_to_target(target) {
        let x = this.unit.pos.x;
        let y = this.unit.pos.y;
        console.log(0);
        if (this.unit.pos.x > target.x) {
            console.log(1);
            x = this.unit.pos.x - 1;
        }
        else if (this.unit.pos.x < target.x) {
            console.log(2);
            x = this.unit.pos.x + 1;
        }
        if (this.unit.pos.y > target.y) {
            console.log(3);
            y = this.unit.pos.y - 1;
        }
        else if (this.unit.pos.y < target.y) {
            console.log(4);
            y = this.unit.pos.y + 1;
        }
        return new Vector(x, y);
    }
}
//# sourceMappingURL=objects.js.map