import { Vector } from "./vector.js"
import { Soldier } from "./objects.js"
import { SoldierConfig } from "./config.js"

export class Controls{


}

export function selecting(x: number, y: number, units: Array<Soldier>){
    console.log("Clicked [", x, ",", y, "]");
    units?.forEach((unit, id) => {
        if (x >= unit.unit.pos.x-SoldierConfig.radius &&
            x <= unit.unit.pos.x+SoldierConfig.radius &&
            y >= unit.unit.pos.y-SoldierConfig.radius &&
            y <= unit.unit.pos.y+SoldierConfig.radius){
            unit.select(true);
            console.log(unit.unit.id, " is selected");
            return true;
        }
    });
    return false
}



