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
    mouseDown(e) {
        let target = new Vector(e.clientX, e.clientY);
        console.log("Coordinate x: " + target.x, "Coordinate y: " + target.y);
        let castles = new Array();
        let currPlayer = "";
        this.gameState.players.forEach((player) => {
            if (player.id == this.gameState.currentPlayerId) {
                currPlayer = player.id;
            }
            castles = castles.concat(player.castles);
        });
        //console.log("CASTLES: ", castles);
        const orders = this.controls.mouseDown(target, castles, currPlayer);
        if (orders === undefined) {
            console.log("NO ORDERS.");
        }
        else {
            console.log("GOT ORDERS!");
            console.log("ORDERS: " + orders);
            if (this.messageHandler) {
                let requestJson = {
                    msgType: "RequestAttackOrderMessage",
                    target_castle_id: orders.target_castle_id,
                    selected_castles_ids: orders.selected_castles_ids,
                };
                this.messageHandler.send(requestJson);
            }
        }
    }
    mouseMove(e) {
        if (this.controls.isSelecting) {
            const target = new Vector(e.clientX, e.clientY);
            let castles = new Array();
            this.gameState.players.forEach((player) => {
                castles = castles.concat(player.castles);
            });
            this.controls.mouseMove(target, castles);
        }
    }
    startConnection() {
        this.messageHandler = new MessageHandler(this);
    }
    eventHandling() {
        this.canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
        this.canvas.addEventListener("mousemove", (e) => this.mouseMove(e));
        window.addEventListener("resize", () => this.displayDriver.resize());
    }
    buildGameStateEvent(players) {
        this.gameState.buildGameState(players);
    }
    attackOrderEvent(soldiers) {
        this.gameState.createSoldiers(soldiers);
    }
    updateGameStateEvent(updates) {
        this.gameState.update(updates);
    }
    setCurrentPlayerId(clientId) {
        this.gameState.setCurrentPlayerId(clientId);
    }
}
//# sourceMappingURL=events.js.map