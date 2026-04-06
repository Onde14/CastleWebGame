import { Soldier, Castle } from "./objects.js"
import { DisplayDriver } from "./display-driver.js"

export class Player{
    id: number;
    ai: boolean;
    units: Array<Soldier>;
    castles: Array<Castle>;
    color: string;


    constructor(ai: boolean, units: Array<Soldier>, castles: Array<Castle>, color: string) {
        this.id = Math.random();
        this.ai = ai;
        this.units = units;
        this.castles = castles;
        this.color = color;
    }
}


export class Gamestate{
    displayDriver: DisplayDriver;
    players: Array<Player>
    constructor(displayDriver: DisplayDriver, players: Array<Player>) {
        this.displayDriver = displayDriver;
        this.players = players;
    }


    public update(){
        this.move_commands();
    }

    private move_commands(){
        this.players.forEach((player) => {
            player.units?.forEach((unit,i) => {
                if (unit.has_found_target()){
                    console.log("Unit", unit.unit.id, " reached target [", unit.unit.pos.x, ",", unit.unit.pos.y,"]");;
                } else {
                    //console.log("Moving Unit", unit.unit.id, " from [", unit.unit.pos.x, ",", unit.unit.pos.y, "] to [", unit.unit.target.x, ",", unit.unit.target.y,"]")
                    let order = unit.move_to_target();
                    unit.unit.pos.x = order.x;
                    unit.unit.pos.y = order.y;
                }
            });
        });
    }

}