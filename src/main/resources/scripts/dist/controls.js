import { Vector } from "./vector.js";
import { CastleConfig } from "./config.js";
export class Controls {
    selected = new Map();
    isSelecting = false;
    isTargetingEnemyCastle = false;
    gameWidth;
    gameHeight;
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }
    deselect() {
        this.selected = new Map();
    }
    visualVector(v) {
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
    isMouseTargetingCastle(target, mouse_pos) {
        const centerToBorderWidth = CastleConfig.width / 2;
        const centerToBorderHeight = CastleConfig.height / 2;
        //console.log("is_mouse_targeting_castle: Target =",target,", mouse_pos=",mouse_pos)
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
    // create_attack_unit_logic(start: Vector, target: Vector) {}
    mouseMove(mouse_pos, castles, playerId) {
        if (!this.isSelecting) {
            return;
        }
        let targeting = false;
        castles.forEach((castle) => {
            if (castle.owner != playerId) {
                if (this.isMouseTargetingCastle(this.visualVector(castle.pos), mouse_pos)) {
                    if (!this.selected.has(castle.id)) {
                        castle.highlighted = true;
                        targeting = true;
                        return;
                    }
                }
                castle.highlighted = false;
            }
        });
        this.isTargetingEnemyCastle = targeting;
    }
    mouseDown(target, castles, playerId) {
        if (this.isTargetingEnemyCastle) {
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
            this.isTargetingEnemyCastle = false;
            this.isSelecting = false;
            const orders = {
                target_castle_id: target_castle_id,
                selected_castles_ids: selected_castles_ids,
            };
            return orders;
        }
        console.log("Clicked ", target);
        let selected_castle = false;
        castles?.forEach((castle, id) => {
            if (this.isMouseTargetingCastle(this.visualVector(castle.pos), target)) {
                if (castle.owner == playerId) {
                    this.selected.set(castle.id, castle);
                    castle.selected = true;
                    console.log(castle.id, " is selected", castle.selected);
                    this.isSelecting = true;
                    selected_castle = true;
                    return;
                }
            }
        });
        if (selected_castle) {
            return undefined;
        }
        this.selected.forEach((castle, _) => castle.selected = false);
        this.deselect();
        this.isSelecting = false;
        return undefined;
    }
}
//# sourceMappingURL=controls.js.map