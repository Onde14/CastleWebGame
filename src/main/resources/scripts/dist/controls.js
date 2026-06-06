import { Vector } from "./vector.js";
import { Soldier, Castle } from "./objects.js";
import { SoldierConfig, CastleConfig } from "./config.js";
export class Controls {
    selected = new Map();
    is_selecting = false;
    is_targeting = false;
    gameWidth;
    gameHeight;
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }
    deselect() {
        this.selected = new Map();
    }
    visual_vector(v) {
        const ratioX = window.innerWidth / this.gameWidth;
        const ratioY = window.innerHeight / this.gameHeight;
        return new Vector(v.x * ratioX, v.y * ratioY);
    }
    /*public move_command(target: Vector){
        let selected_units = this.selected.filter((object): object is Soldier => object instanceof Soldier);
        selected_units.forEach(unit => {
            unit.give_target(target);
        });
    }
  
      */
    is_mouse_targeting_castle(target, mouse_pos) {
        const centerToBorderWidth = CastleConfig.width / 2;
        const centerToBorderHeight = CastleConfig.height / 2;
        console.log("is_mouse_targeting_castle: Target =", target, ", mouse_pos=", mouse_pos);
        return (target.x - centerToBorderWidth <= mouse_pos.x &&
            target.x + centerToBorderWidth >= mouse_pos.x &&
            target.y - centerToBorderHeight <= mouse_pos.y &&
            target.y + centerToBorderHeight >= mouse_pos.y);
    }
    /*add_targeting_boundaries(minX: number, maxX: number, minY: number, maxY: number){
        this.targetBoundaries.push(minX);
        this.targetBoundaries.push(maxX);
        this.targetBoundaries.push(minY);
        this.targetBoundaries.push(maxY);
    }
  
      */
    create_attack_unit_logic(start, target) { }
    mouse_move(mouse_pos, castles) {
        if (!this.is_selecting) {
            return;
        }
        let targeting = false;
        castles.forEach((castle) => {
            if (this.is_mouse_targeting_castle(this.visual_vector(castle.pos), mouse_pos)) {
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
            const target_castle_id = target_castle.id;
            let selected_castles_ids = new Array();
            this.selected.forEach((castle) => {
                selected_castles_ids.push(castle.id);
                castle.selected = false;
            });
            this.selected = new Map();
            this.is_targeting = false;
            this.is_selecting = false;
            const orders = {
                target_castle_id: target_castle_id,
                selected_castles_ids: selected_castles_ids,
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
            if (this.is_mouse_targeting_castle(this.visual_vector(castle.pos), target)) {
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
        return orders;
    }
}
//# sourceMappingURL=controls.js.map