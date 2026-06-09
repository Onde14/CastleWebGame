import { CastleConfig, SoldierConfig, RoadConfig, VillageConfig } from "./config.js";
import { Vector } from "./vector.js";

export class GameObject {
  movable: boolean;
  selectable: boolean;
  health: number;
  constructor(movable: boolean, selectable: boolean, health: number) {
    this.movable = movable;
    this.selectable = selectable;
    this.health = health;
  }
}

class Structure extends GameObject {
  id: string;
  type: string;
  pos: Vector;
  width: number;
  height: number;

  constructor(
    selectable: boolean,
    type: string,
    pos: Vector,
    width: number,
    height: number,
    id: string,
    health: number,
  ) {
    super(false, selectable, health);
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.width = width;
    this.height = height;
  }
}

class Unit extends GameObject {
  id: string;
  type: string;
  pos: Vector;
  width: number;
  height: number;
  target: Vector;
  moving = false;

  constructor(
    movable: boolean,
    id: string,
    type: string,
    pos: Vector,
    width: number,
    height: number,
    health: number,
  ) {
    super(movable, false, health);
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.target = new Vector(0, 0);
  }
}

export class Castle extends Structure {
  selected = false;
  targeted = false;
  owner: string;
  ownerColor: string;
  highlighted = false;
  villages: Array<Village>;
  connections: Array<String>

  constructor(pos: Vector, id: string, owner: string, ownerColor: string, health: number, villages: Array<Village>, connections: Array<String>) {
    super(true, "castle", pos, CastleConfig.width, CastleConfig.height, id, health);
    this.owner = owner;
    this.ownerColor = ownerColor;
    this.villages = villages;
    this.connections = connections;
  }
}
/* export class Road extends Structure {
  selected = false;
  constructor(pos: Vector, height: number) {
    super(false, "road", pos, RoadConfig.width, height);
  }
}*/

export class Village extends Structure {
  owner: string;
  constructor(pos: Vector, id: string, owner: string, health: number) {
    super(true, "village", pos, VillageConfig.width, VillageConfig.height, id, health);
    this.owner = owner;
  }
}

export class Soldier extends Unit {
  owner: string;
  ownerColor: string;
  constructor(pos: Vector, id: string, owner: string, ownerColor: string, health: number) {
    super(true, id, "soldier", pos, SoldierConfig.width, SoldierConfig.height, health);
    this.owner = owner;
    this.ownerColor = ownerColor;
  }

  public give_target(target: Vector) {
    this.target = target;
    this.moving = true;
  }

  public move_to_target() {
    let newX = this.pos.x;
    let newY = this.pos.y;
    let ratio =
      Math.abs(this.target.x - this.pos.x) /
      Math.abs(this.target.y - this.pos.y);
    let movementMul = 1;
    let xMovementSpeed = movementMul * (ratio / (ratio + 1));
    let yMovementSpeed = movementMul * (1 / (ratio + 1));
    if (this.pos.x > this.target.x) {
      newX = this.pos.x - xMovementSpeed;
    } else if (this.pos.x < this.target.x) {
      newX = this.pos.x + xMovementSpeed;
    }
    if (this.pos.y > this.target.y) {
      newY = this.pos.y - yMovementSpeed;
    } else if (this.pos.y < this.target.y) {
      newY = this.pos.y + yMovementSpeed;
    }
    /*
        console.log("this.unit.target.x = ", this.unit.target.x);
        console.log("this.unit.pos.x = ", this.unit.pos.x);
        console.log("this.unit.target.y = ", this.unit.target.y);
        console.log("this.unit.pos.y = ", this.unit.pos.y);

        console.log("RATIO = ", ratio);
        console.log("newX = ", newX);
        console.log("xMovementSpeed = ", xMovementSpeed);
        console.log("newY = ", newY);
        console.log("yMovementSpeed = ", yMovementSpeed);


        console.log("negate: ", newX-newY);


         */
    this.pos = new Vector(newX, newY);
  }

  public has_found_target() {
    console.log();
    if (
      Math.abs(this.pos.x - this.target.x) < 0.5 &&
      Math.abs(this.pos.y - this.target.y) < 0.5
    ) {
      this.moving = false;
      return true;
    } else {
      return false;
    }
  }
}
