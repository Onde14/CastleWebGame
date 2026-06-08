import { Soldier, Castle, Village, GameObject } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";

export class Player {
  id: string;
  ai: boolean;
  units: Array<Soldier>;
  castles: Array<Castle>;
  villages: Array<Village>;
  color: string;

  constructor(
    ai: boolean,
    id: string,
    units: Array<Soldier>,
    castles: Array<Castle>,
    villages: Array<Village>,
    color: string,
  ) {
    this.id = id;
    this.ai = ai;
    this.units = units;
    this.castles = castles;
    this.villages = villages;
    this.color = color;
  }
}

export class Gamestate {
  displayDriver: DisplayDriver;
  players = Array<Player>();
  gameObjects = new Map<string, GameObject>();
  currentPlayerId: string = "";
  currentPlayerColor: string = "";
  constructor(displayDriver: DisplayDriver) {
    this.displayDriver = displayDriver;
  }

  public setCurrentPlayerId(clientId: string) {
    this.currentPlayerId = clientId
  }
  public buildGameState(players: any) {
    console.log("PLAYERS1: ", players);
    let playerArray = new Array<Player>();
    players.forEach((player: any) => {
      if (player.id == this.currentPlayerId) {
        this.currentPlayerColor == player.color;
      }
      const id: Int16Array = player.id;
      let newPlayer = new Player(
        false,
        player.id,
        new Array<Soldier>(),
        new Array<Castle>(),
        new Array<Village>(),
        player.color,
      );
      player.castles.forEach((castle: any) => {
        let villages = new Array<Village>();
        castle.villages.forEach((village: any) => {
          const newVillage = new Village(
            new Vector(village.pos.x, village.pos.y),
            village.id,
            village.id,
            village.health,
          );
          villages.push(newVillage);
          this.gameObjects.set(newVillage.id, newVillage);
        });
        const newCastle = new Castle(
          new Vector(castle.pos.x, castle.pos.y),
          castle.id,
          castle.owner,
          castle.ownerColor,
          castle.health,
          castle.villages = villages
        );
        castle.villages.forEach((village: any) => {
          const newVillage = new Village(
            new Vector(village.pos.x, village.pos.y),
            village.id,
            village.id,
            village.health,
          );
          newCastle.villages.push(newVillage);
        });
        newPlayer.castles.push(newCastle);
        this.gameObjects.set(newCastle.id, newCastle);
      });

      player.units.forEach((soldier: any) => {
        const newSoldier = new Soldier(
          new Vector(soldier.pos.x, soldier.pos.y),
          soldier.id,
          soldier.owner,
          soldier.ownerColor,
          soldier.health,
        );
        if (soldier.target !== undefined) {
          newSoldier.give_target(new Vector(soldier.target.x, soldier.target.y));
        }
        newPlayer.units.push(newSoldier);
        this.gameObjects.set(newSoldier.id, newSoldier);
      });
      playerArray.push(newPlayer);
    });
    this.players = playerArray;
    console.log("PLAYERS2: ", this.players);
  }

  public createSoldiers(soldiers: any) {
    soldiers.forEach((soldier: any) => {
      console.log("createSoldiers: 1")
      let new_soldier = new Soldier(
        new Vector(soldier.pos.x, soldier.pos.y),
        soldier.id,
        soldier.owner,
        soldier.ownerColor,
        soldier.health,
      );
      console.log("createSoldiers: 2")

      let attackerPlayer = this.players.find(
        (player) => player.id == soldier.owner,
      );
      console.log("createSoldiers: 3")

      if (attackerPlayer !== undefined) {
        attackerPlayer.units.push(new_soldier);
      }
      console.log("createSoldiers: 4")

      new_soldier.give_target(new Vector(soldier.target.x, soldier.target.y));
      this.gameObjects.set(new_soldier.id, new_soldier);
      console.log("NEW SOLDIER CREATED: ", new_soldier);
    });
  }

  public update(updates: any) {
    console.log(1, updates);
    updates.forEach((u: any) => {
      //console.log(2, u, u, u.id, u.pos);
      if (u.state == 2) {
        // console.log(3, u.id, this.gameObjects);
        let object: any = this.gameObjects.get(u.id);
        //console.log(object);
        //console.log(4);
        object.pos = new Vector(u.updatedPos.x, u.updatedPos.y);
      } else if (u.state == 0) {
        let object: any = this.gameObjects.get(u.id);
        if (object instanceof Soldier) {
          const player = this.players.find((p) => p.id == u.playerId);
          console.log("PLAYER",player)
          if (player !== undefined) {
            //console.log(6, player);
            player.units = player.units.filter((unit) => unit.id != u.id);
            this.gameObjects.delete(u.id);
            //console.log(6, player.units, this.gameObjects);
          }
          console.log("IS SOLDIER",object)
        }
        if (object instanceof Village) {
          console.log("IS VILLAGE", object)
          const player = this.players.find((p) => p.id == u.playerId)!;
          const castle = player.castles.find((c) => c.owner == u.playerId)!;
          castle.villages = castle.villages.filter((v) => v.id != u.id)
          this.gameObjects.delete(u.id);
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
