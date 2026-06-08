import { Soldier, Castle, Village } from "./objects.js";
import { Vector } from "./vector.js";
export class Player {
    id;
    ai;
    units;
    castles;
    villages;
    color;
    constructor(ai, id, units, castles, villages, color) {
        this.id = id;
        this.ai = ai;
        this.units = units;
        this.castles = castles;
        this.villages = villages;
        this.color = color;
    }
}
export class Gamestate {
    displayDriver;
    players = Array();
    gameObjects = new Map();
    currentPlayerId = "";
    currentPlayerColor = "";
    constructor(displayDriver) {
        this.displayDriver = displayDriver;
    }
    setCurrentPlayerId(clientId) {
        this.currentPlayerId = clientId;
    }
    buildGameState(players) {
        console.log("PLAYERS1: ", players);
        let playerArray = new Array();
        players.forEach((player) => {
            if (player.id == this.currentPlayerId) {
                this.currentPlayerColor == player.color;
            }
            const id = player.id;
            let newPlayer = new Player(false, player.id, new Array(), new Array(), new Array(), player.color);
            player.castles.forEach((castle) => {
                let villages = new Array();
                castle.villages.forEach((village) => {
                    const newVillage = new Village(new Vector(village.pos.x, village.pos.y), village.id, village.id, village.health);
                    villages.push(newVillage);
                    this.gameObjects.set(newVillage.id, newVillage);
                });
                const newCastle = new Castle(new Vector(castle.pos.x, castle.pos.y), castle.id, castle.owner, castle.ownerColor, castle.health, castle.villages = villages);
                castle.villages.forEach((village) => {
                    const newVillage = new Village(new Vector(village.pos.x, village.pos.y), village.id, village.id, village.health);
                    newCastle.villages.push(newVillage);
                });
                newPlayer.castles.push(newCastle);
                this.gameObjects.set(newCastle.id, newCastle);
            });
            player.units.forEach((soldier) => {
                const newSoldier = new Soldier(new Vector(soldier.pos.x, soldier.pos.y), soldier.id, soldier.owner, soldier.ownerColor, soldier.health);
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
    createSoldiers(soldiers) {
        soldiers.forEach((soldier) => {
            console.log("createSoldiers: 1");
            let new_soldier = new Soldier(new Vector(soldier.pos.x, soldier.pos.y), soldier.id, soldier.owner, soldier.ownerColor, soldier.health);
            console.log("createSoldiers: 2");
            let attackerPlayer = this.players.find((player) => player.id == soldier.owner);
            console.log("createSoldiers: 3");
            if (attackerPlayer !== undefined) {
                attackerPlayer.units.push(new_soldier);
            }
            console.log("createSoldiers: 4");
            new_soldier.give_target(new Vector(soldier.target.x, soldier.target.y));
            this.gameObjects.set(new_soldier.id, new_soldier);
            console.log("NEW SOLDIER CREATED: ", new_soldier);
        });
    }
    update(updates) {
        // console.log(1);
        updates.forEach((u) => {
            //console.log(2, u, u, u.id, u.pos);
            if (u.state == 2) {
                // console.log(3, u.id, this.gameObjects);
                let object = this.gameObjects.get(u.id);
                //console.log(object);
                //console.log(4);
                object.pos = new Vector(u.updatedPos.x, u.updatedPos.y);
            }
            else if (u.state == 0) {
                let object = this.gameObjects.get(u.id);
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
    move_commands() {
        this.players.forEach((player) => {
            let moving_units = player.units?.filter((unit) => unit.moving == true);
            moving_units.forEach((unit, i) => {
                if (unit.has_found_target()) {
                    console.log("Unit", unit.id, " reached target [", unit.pos.x, ",", unit.pos.y, "]");
                    unit.moving = false;
                }
                else {
                    //console.log("Moving Unit", unit.unit.id, " from [", unit.unit.pos.x, ",", unit.unit.pos.y, "] to [", unit.unit.target.x, ",", unit.unit.target.y,"]")
                    unit.move_to_target();
                }
            });
        });
    }
}
//# sourceMappingURL=gamestate.js.map