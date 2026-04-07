import { Soldier, Castle } from "./objects.js";
import { DisplayDriver } from "./display-driver.js";
export class Player {
    id;
    ai;
    units;
    castles;
    color;
    constructor(ai, units, castles, color) {
        this.id = Math.random();
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
    create_attack(orders) {
        console.log(1);
        const target = orders.at(0);
        console.log(2);
        // @ts-ignore
        const selected = orders.slice(1, orders.length);
        const ownerPlayer = this.players.find(player => player.id == this.currentPlayerId);
        console.log(selected);
        selected.forEach((castle) => {
            let new_soldier = new Soldier(castle.pos, castle.owner, castle.ownerColor);
            console.log("OWNER: ", ownerPlayer);
            ownerPlayer?.units.push(new_soldier);
            new_soldier.give_target(target);
        });
        console.log(ownerPlayer);
    }
    update() {
        this.move_commands();
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