import { Soldier, Castle } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import type { Vector } from "./vector.js";

export class Player {
  id: number;
  ai: boolean;
  units: Array<Soldier>;
  castles: Array<Castle>;
  color: string;

  constructor(
    ai: boolean,
    units: Array<Soldier>,
    castles: Array<Castle>,
    color: string,
  ) {
    this.id = Math.random();
    this.ai = ai;
    this.units = units;
    this.castles = castles;
    this.color = color;
  }
}

export class Gamestate {
  displayDriver: DisplayDriver;
  players: Array<Player>;
  currentPlayerId: number;
  constructor(
    displayDriver: DisplayDriver,
    players: Array<Player>,
    currentPlayerId: number,
  ) {
    this.displayDriver = displayDriver;
    this.players = players;
    this.currentPlayerId = currentPlayerId;
  }

  public create_attack(orders: Array<Castle | Vector>) {
    console.log(1);
    const target: Vector = <Vector>orders.at(0);
    console.log(2);
    // @ts-ignore
    const selected: Castle[] = orders.slice(1, orders.length);
    const ownerPlayer = this.players.find(
      (player) => player.id == this.currentPlayerId,
    );
    console.log(selected);
    selected.forEach((castle: Castle) => {
      let new_soldier = new Soldier(
        castle.pos,
        castle.owner,
        castle.ownerColor,
      );
      console.log("OWNER: ", ownerPlayer);
      ownerPlayer?.units.push(new_soldier);
      new_soldier.give_target(target);
    });
    console.log(ownerPlayer);
  }

  public update() {
    this.move_commands();
  }

  private move_commands() {
    this.players.forEach((player) => {
      let moving_units = player.units?.filter((unit) => unit.moving == true);
      moving_units.forEach((unit, i) => {
        if (unit.has_found_target()) {
          console.log(
            "Unit",
            unit.id,
            " reached target [",
            unit.pos.x,
            ",",
            unit.pos.y,
            "]",
          );
          unit.moving = false;
        } else {
          //console.log("Moving Unit", unit.unit.id, " from [", unit.unit.pos.x, ",", unit.unit.pos.y, "] to [", unit.unit.target.x, ",", unit.unit.target.y,"]")
          unit.move_to_target();
        }
      });
    });
  }
}
