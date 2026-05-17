import { Soldier, Castle } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";

export class Player {
  id: number;
  ai: boolean;
  units: Array<Soldier>;
  castles: Array<Castle>;
  color: string;

  constructor(
    ai: boolean,
    id: number,
    units: Array<Soldier>,
    castles: Array<Castle>,
    color: string,
  ) {
    this.id = id;
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

  public create_soldiers(soldiers: any) {
    soldiers.forEach((soldier: any) => {
      let new_soldier = new Soldier(
        new Vector(soldier.pos.x, soldier.pos.y),
        soldier.id,
        soldier.owner,
        soldier.ownerColor,
      );
      let attackerPlayer = this.players.find(
        (player) => player.id == soldier.owner,
      );
      if (attackerPlayer !== undefined) {
        attackerPlayer.units.push(new_soldier);
      }
      new_soldier.give_target(new Vector(soldier.target.x, soldier.target.y));
    });
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
