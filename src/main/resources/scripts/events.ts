import { Gamestate } from "./gamestate.js"
import type {Castle} from "./objects";
import {Vector} from "./vector.js";
import type {Controls} from "./controls.js";
import type {DisplayDriver} from "./display-driver.js";


export class EventHandler{
    canvas: HTMLCanvasElement;
    gameState: Gamestate;
    controls: Controls;
    displayDriver: DisplayDriver;
    constructor(canvas: HTMLCanvasElement, gameState: Gamestate, controls: Controls, displayDriver: DisplayDriver) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.controls = controls;
        this.displayDriver = displayDriver;
    }

    mouse_down(e: MouseEvent){
        let target = new Vector(e.clientX,e.clientY);
        console.log("Coordinate x: " + target.x, "Coordinate y: " + target.y);
        let castles = new Array<Castle>();
        let currPlayer = 0;
        this.gameState.players.forEach(player => {
            if (player.id == this.gameState.currentPlayerId){
                currPlayer = player.id;
            }
            castles = castles.concat(player.castles)
        });
        console.log("CASTLES: ", castles);
        let orders:Array<Castle|Vector> = this.controls.mouse_down(target,castles,currPlayer);
        if (orders.length < 1){
            console.log("NO ORDERS.");
        } else {
            console.log("GOT ORDERS!");
            this.gameState.create_attack(orders);
        }
    }

    mouse_move(e: MouseEvent){
        if (this.controls.is_selecting){
            let target = new Vector(e.clientX,e.clientY);
            let castles = new Array<Castle>;
            this.gameState.players.forEach(player => {
                castles = castles.concat(player.castles);
            });
            this.controls.mouse_move(target,castles);
        }
    }

    public event_handling(){
        this.canvas.addEventListener("mousedown", (e) => this.mouse_down(e));

        this.canvas.addEventListener("mousemove", e => this.mouse_move(e));

        window.addEventListener("resize", () => this.displayDriver.resize());
    }

}