import { Soldier, Castle } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
import { Vector } from "./vector.js";
export class Player {
    id;
    ai;
    units;
    castles;
    color;
    constructor(ai, id, units, castles, color) {
        this.id = id;
        this.ai = ai;
        this.units = units;
        this.castles = castles;
        this.color = color;
    }
}
export class Gamestate {
    displayDriver;
    players;
    currentPlayerId;
    constructor(displayDriver, players, currentPlayerId) {
        this.displayDriver = displayDriver;
        this.players = players;
        this.currentPlayerId = currentPlayerId;
    }
    create_soldiers(soldiers) {
        soldiers.forEach((soldier) => {
            let new_soldier = new Soldier(new Vector(soldier.pos.x, soldier.pos.y), soldier.id, soldier.owner, soldier.ownerColor);
            let attackerPlayer = this.players.find((player) => player.id == soldier.owner);
            if (attackerPlayer !== undefined) {
                attackerPlayer.units.push(new_soldier);
            }
            new_soldier.give_target(new Vector(soldier.target.x, soldier.target.y));
        });
    }
    update(updatedPlayers) {
        let playerArray = new Array();
        updatedPlayers.forEach((player) => {
            let newPlayer = new Player(false, player.id, new Array(), new Array(), player.color);
            player.castles.forEach((castle) => {
                const newCastle = new Castle(new Vector(castle.pos.x, castle.pos.y), castle.id, castle.owner, castle.ownerColor);
                newPlayer.castles.push(newCastle);
            });
            player.units.forEach((unit) => {
                const newSoldier = new Soldier(new Vector(unit.pos.x, unit.pos.y), unit.id, unit.owner, unit.ownerColor);
                if (unit.target !== undefined) {
                    newSoldier.give_target(new Vector(unit.target.x, unit.target.y));
                }
                newPlayer.units.push(newSoldier);
            });
            playerArray.push(newPlayer);
        });
        this.players = playerArray;
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