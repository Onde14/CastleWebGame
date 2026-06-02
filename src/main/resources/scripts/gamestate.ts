import { Soldier, Castle, GameObject } from "./objects.js";
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
  players = Array<Player>();
  gameObjects = new Map<number, GameObject>();
  currentPlayerId: number;
  constructor(displayDriver: DisplayDriver, currentPlayerId: number) {
    this.displayDriver = displayDriver;
    this.currentPlayerId = currentPlayerId;
  }

  public buildGameState(currentPlayerId: number, players: any) {
    console.log("PLAYERS1: ", players);
    this.currentPlayerId = currentPlayerId;
    let playerArray = new Array<Player>();
    players.forEach((player: any) => {
      const id: Int16Array = player.id;
      let newPlayer = new Player(
        false,
        player.id,
        new Array<Soldier>(),
        new Array<Castle>(),
        player.color,
      );
      player.castles.forEach((castle: any) => {
        const newCastle = new Castle(
          new Vector(castle.pos.x, castle.pos.y),
          castle.id,
          castle.owner,
          castle.ownerColor,
        );
        newPlayer.castles.push(newCastle);
        this.gameObjects.set(newCastle.id, newCastle);
      });
      player.units.forEach((unit: any) => {
        const newSoldier = new Soldier(
          new Vector(unit.pos.x, unit.pos.y),
          unit.id,
          unit.owner,
          unit.ownerColor,
        );
        if (unit.target !== undefined) {
          newSoldier.give_target(new Vector(unit.target.x, unit.target.y));
        }
        newPlayer.units.push(newSoldier);
        this.gameObjects.set(newSoldier.id, newSoldier);
      });
      playerArray.push(newPlayer);
    });
    this.players = playerArray;
    console.log("PLAYERS2: ", this.players);
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
      this.gameObjects.set(new_soldier.id, new_soldier);
      console.log("NEW SOLDIER CREATED: ", new_soldier);
    });
  }

  public update(updates: any) {
    console.log(1);
    updates.forEach((u: any) => {
      //console.log(2, u, u, u.id, u.pos);
      if (u.state == 2) {
        console.log(3, u.id, this.gameObjects);
        let object: any = this.gameObjects.get(u.id);
        console.log(object);
        console.log(4);
        object.pos = new Vector(u.updatedPos.x, u.updatedPos.y);
      } else if (u.state == 0) {
        let object: any = this.gameObjects.get(u.id);
        //console.log(5, object);
        const player = this.players.filter((p) => p.id == u.playerId)[0];
        if (player !== undefined) {
          //console.log(6, player);
          player.units = player.units.filter((unit) => unit.id != u.id);
          this.gameObjects.delete(u.id);
          //console.log(6, player.units, this.gameObjects);
        }
      }
    });
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
