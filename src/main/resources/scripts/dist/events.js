import { Gamestate } from "./gamestate.js";
import { Vector } from "./vector.js";
import { WebSocketDriver } from "./websocket.js";
export class EventHandler {
    canvas;
    gameState;
    controls;
    displayDriver;
    webSocketDriver;
    constructor(canvas, gameState, controls, displayDriver, webSocketDriver) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.controls = controls;
        this.displayDriver = displayDriver;
        this.webSocketDriver = webSocketDriver;
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
        console.log("CASTLES: ", castles);
        let orders = this.controls.mouse_down(target, castles, currPlayer);
        if (orders.length < 1) {
            console.log("NO ORDERS.");
        }
        else {
            console.log("GOT ORDERS!");
            this.gameState.create_attack(orders);
            this.webSocketDriver.sendMessage("Attack: " + target.x + ", " + target.y);
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
    event_handling() {
        this.canvas.addEventListener("mousedown", (e) => this.mouse_down(e));
        this.canvas.addEventListener("mousemove", (e) => this.mouse_move(e));
        window.addEventListener("resize", () => this.displayDriver.resize());
    }
}
//# sourceMappingURL=events.js.map