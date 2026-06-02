import { Gamestate, Player } from "./gamestate.js";
import { Soldier, Castle } from "./objects.js";
import { Vector } from "./vector.js";
import { MessageHandler } from "./messagehandling.js";
export class EventHandler {
    canvas;
    gameState;
    controls;
    displayDriver;
    messageHandler;
    constructor(canvas, gameState, controls, displayDriver) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.controls = controls;
        this.displayDriver = displayDriver;
    }
    mouse_down(e) {
        let target = new Vector(e.clientX, e.clientY);
        console.log("Coordinate x: " + target.x, "Coordinate y: " + target.y);
        let castles = new Array();
        let currPlayer = 0;
        this.gameState.players.forEach((player) => {
            if (player.id == this.gameState.currentPlayerId) {
                currPlayer = player.id;
            }
            castles = castles.concat(player.castles);
        });
        //console.log("CASTLES: ", castles);
        const orders = this.controls.mouse_down(target, castles, currPlayer);
        if (orders === undefined) {
            console.log("NO ORDERS.");
        }
        else {
            console.log("GOT ORDERS!");
            console.log("ORDERS: " + orders);
            if (this.messageHandler) {
                const requestJson = {
                    msgType: "AttackOrder",
                    playerId: currPlayer,
                    target_castle_id: orders.target_castle_id,
                    selected_castles_ids: orders.selected_castles_ids,
                };
                this.messageHandler.send(requestJson);
            }
        }
    }
    mouse_move(e) {
        if (this.controls.is_selecting) {
            let target = new Vector(e.clientX, e.clientY);
            let castles = new Array();
            this.gameState.players.forEach((player) => {
                castles = castles.concat(player.castles);
            });
            this.controls.mouse_move(target, castles);
        }
    }
    startConnection() {
        this.messageHandler = new MessageHandler(this);
    }
    event_handling() {
        this.canvas.addEventListener("mousedown", (e) => this.mouse_down(e));
        this.canvas.addEventListener("mousemove", (e) => this.mouse_move(e));
        window.addEventListener("resize", () => this.displayDriver.resize());
    }
    buildGameStateEvent(currentPlayerId, currentPlayerColor, players) {
        this.gameState.buildGameState(currentPlayerId, currentPlayerColor, players);
    }
    attackOrderEvent(soldiers) {
        this.gameState.create_soldiers(soldiers);
    }
    updateGameStateEvent(updates) {
        this.gameState.update(updates);
    }
}
//# sourceMappingURL=events.js.map