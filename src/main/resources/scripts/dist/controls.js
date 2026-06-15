import { Vector } from "./vector.js";
import { CastleConfig } from "./config.js";
import { GameStatus, PlayerState } from "./gamestate.js";
import { UIStates, Button, TextField } from "./ui.js";
export class Controls {
    selected = new Map();
    isSelecting = false;
    isTargetingEnemyCastle = false;
    gameWidth;
    gameHeight;
    gameState;
    ui;
    canvas;
    constructor(gameWidth, gameHeight, canvas, gameState, ui) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.canvas = canvas;
        this.gameState = gameState;
        this.ui = ui;
    }
    deselect() {
        this.selected = new Map();
    }
    visualVector(v) {
        const ratioX = this.canvas.width / this.gameWidth;
        const ratioY = this.canvas.height / this.gameHeight;
        return new Vector(v.x * ratioX, v.y * ratioY);
    }
    /*public move_command(target: Vector){
        let selected_units = this.selected.filter((object): object is Soldier => object instanceof Soldier);
        selected_units.forEach(unit => {
            unit.give_target(target);
        });
    }
  
      */
    isMouseTargetingElement(target, mouse_pos, button) {
        const visualWidth = button.width * (this.canvas.width / this.gameWidth);
        const visualHeight = button.height * (this.canvas.width / this.gameWidth);
        //const centerToBorderWidth = button.width / 2;
        //const centerToBorderHeight = button.height / 2;
        //console.log("is_mouse_targeting_button: Target =", target, ", mouse_pos=", mouse_pos,"visualLengths.x",visualWidth,"visualLengths.y",visualHeight,"width:",button.width,"height:",button.height)
        return (target.x <= mouse_pos.x &&
            target.x + visualWidth >= mouse_pos.x &&
            target.y <= mouse_pos.y &&
            target.y + visualHeight >= mouse_pos.y);
    }
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
        if (!this.isSelecting &&
            this.ui.state != UIStates.Game &&
            this.gameState.currentPlayer?.state != PlayerState.Playing &&
            this.gameState.state == GameStatus.Ended) {
            return;
        }
        let targeting = false;
        castles.forEach((castle) => {
            if (this.isMouseTargetingCastle(this.visualVector(castle.pos), mouse_pos)) {
                if (castle.owner != playerId) {
                    if (!this.selected.has(castle.id)) {
                        castle.highlighted = true;
                        targeting = true;
                        return;
                    }
                }
                else {
                    castle.highlighted = false;
                }
            }
            else {
                castle.highlighted = false;
            }
        });
        this.isTargetingEnemyCastle = targeting;
    }
    mouseDownButton(target, buttons) {
        let button = null;
        buttons.some(b => {
            if (b instanceof Button) {
                //console.log("BUTTON", b.text)
                if (this.isMouseTargetingElement(this.visualVector(b.pos), target, b)) {
                    button = b;
                    //console.log("BUTTON",b.text ,"PRESSED")
                    return true;
                }
                else {
                    //console.log("NO BUTTON")
                }
            }
            else if (b instanceof TextField) {
                if (this.isMouseTargetingElement(this.visualVector(b.pos), target, b)) {
                    b.active = true;
                    b.text = "";
                    //console.log("TEXTFIELD ACTIVE");
                    return true;
                }
                else {
                    b.active = false;
                }
            }
        });
        return button;
    }
    mouseDownGame(target, castles = Array(), playerId = "") {
        if (this.ui.state != UIStates.Game &&
            this.gameState.currentPlayer?.state != PlayerState.Playing &&
            this.gameState.state == GameStatus.Ended) {
            return;
        }
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
        //console.log("Clicked ", target);
        let selected_castle = false;
        castles?.forEach((castle, id) => {
            if (this.isMouseTargetingCastle(this.visualVector(castle.pos), target)) {
                if (castle.owner == playerId) {
                    this.selected.set(castle.id, castle);
                    castle.selected = true;
                    //console.log(castle.id, " is selected", castle.selected);
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