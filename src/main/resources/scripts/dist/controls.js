import { Vector } from "./vector.js";
import { Soldier, Castle } from "./objects.js";
import { SoldierConfig, CastleConfig } from "./config.js";
export class Controls {
    selected = new Map();
    is_selecting = false;
    is_targeting = false;
    constructor() { }
    deselect() {
        this.selected = new Map();
    }
    /*public move_command(target: Vector){
        let selected_units = this.selected.filter((object): object is Soldier => object instanceof Soldier);
        selected_units.forEach(unit => {
            unit.give_target(target);
        });
    }
  
      */
    is_click_targeting_castle(target, click) {
        const centerToBorderWidth = CastleConfig.width / 2;
        const centerToBorderHeight = CastleConfig.height / 2;
        return (target.x - centerToBorderWidth <= click.x &&
            target.x + centerToBorderWidth >= click.x &&
            target.y - centerToBorderHeight <= click.y &&
            target.y + centerToBorderHeight >= click.y);
    }
    /*add_targeting_boundaries(minX: number, maxX: number, minY: number, maxY: number){
        this.targetBoundaries.push(minX);
        this.targetBoundaries.push(maxX);
        this.targetBoundaries.push(minY);
        this.targetBoundaries.push(maxY);
    }
  
      */
    create_attack_unit_logic(start, target) { }
    mouse_move(target, castles) {
        if (!this.is_selecting) {
            return;
        }
        let targeting = false;
        castles.forEach((castle) => {
            if (this.is_click_targeting_castle(castle.pos, target)) {
                if (!this.selected.has(castle.id)) {
                    castle.highlighted = true;
                    targeting = true;
                    return;
                }
            }
            castle.highlighted = false;
        });
        this.is_targeting = targeting;
    }
    mouse_down(target, castles, playerId) {
        if (this.is_targeting) {
            // @ts-ignore
            const target_castle = castles
                .filter((castle) => castle.highlighted == true)
                .at(0);
            // @ts-ignore
            target_castle.highlighted = false;
            let selected_castles = new Array();
            this.selected.forEach((castle) => {
                selected_castles.push(castle);
                castle.selected = false;
            });
            this.selected = new Map();
            this.is_targeting = false;
            this.is_selecting = false;
            const orders = {
                target_castle: target_castle,
                selected_castles: selected_castles,
            };
            return orders;
        }
        console.log("Clicked ", target);
        let selecting = false;
        castles?.forEach((castle, id) => {
            /*
              const centerToBorderWidth = CastleConfig.width/2;
              const centerToBorderHeight = CastleConfig.height/2;
              console.log(castle.pos.x - centerToBorderWidth <= target.x);
              console.log(castle.pos.x + centerToBorderWidth >= target.x);
              console.log(castle.pos.y - centerToBorderHeight <= target.y);
              console.log(castle.pos.y + centerToBorderHeight >= target.y);
      
      
                */
            if (this.is_click_targeting_castle(castle.pos, target)) {
                if (castle.owner == playerId) {
                    this.deselect();
                    this.selected.set(castle.id, castle);
                    console.log(castle.id, " is selected");
                    selecting = true;
                }
            }
        });
        const orders = undefined;
        this.is_selecting = selecting;
        console.log("NO NO NO ON O ORDERS: ");
        return orders;
    }
}
//# sourceMappingURL=controls.js.map