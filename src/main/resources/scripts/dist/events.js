import { Vector } from "./vector.js";
import { MessageHandler } from "./messagehandling.js";
import { UIStates, ButtonEvent, TextField, TextFieldEvent } from "./ui.js";
export class EventHandler {
    canvas;
    gameState;
    controls;
    displayDriver;
    messageHandler;
    ui;
    socketOpen = false;
    username = "";
    constructor(canvas, gameState, controls, displayDriver, ui) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.controls = controls;
        this.displayDriver = displayDriver;
        this.ui = ui;
        this.messageHandler = new MessageHandler(this);
    }
    async curlLogin() {
        let username;
        let password;
        this.ui.menu.forEach(b => {
            if (b instanceof TextField) {
                if (b.event == TextFieldEvent.Username) {
                    username = b.text;
                }
                if (b.event == TextFieldEvent.Password) {
                    password = b.text;
                }
            }
        });
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify({ "username": username, "password": password })
        });
        const data = await response.text();
        console.log(data);
        if (data == username) {
            this.username = data;
        }
    }
    mouseDown(e) {
        const target = new Vector(e.clientX, e.clientY);
        switch (this.ui.state) {
            case UIStates.Menu:
                let resMenu = this.controls.mouseDownButton(target, this.ui.menu);
                if (resMenu) {
                    switch (resMenu.event) {
                        case ButtonEvent.Matchmake:
                            this.ui.state = UIStates.Matchmaking;
                            this.startConnection();
                            break;
                        case ButtonEvent.loginButton:
                            this.curlLogin();
                        default:
                            break;
                    }
                }
                break;
            case UIStates.Matchmaking:
                let resMatchmake = this.controls.mouseDownButton(target, this.ui.matchMaking);
                if (resMatchmake) {
                    switch (resMatchmake.event) {
                        case ButtonEvent.Menu:
                            const close = {
                                msgType: "CloseConnection"
                            };
                            this.messageHandler.send(close);
                            this.closeConnection();
                            this.ui.state = UIStates.Menu;
                            break;
                        default:
                            break;
                    }
                }
                break;
            case UIStates.Game:
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
                const orders = this.controls.mouseDownGame(target, castles, currPlayer);
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
                break;
            case UIStates.EndGame:
                let resEndGame = this.controls.mouseDownButton(target, this.ui.endGame);
                if (resEndGame) {
                    switch (resEndGame.event) {
                        case ButtonEvent.Menu:
                            this.closeConnection();
                            this.ui.state = UIStates.Menu;
                            this.gameState.resetGameState();
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }
    }
    mouseMove(e) {
        if (this.controls.isSelecting) {
            const target = new Vector(e.clientX, e.clientY);
            let castles = new Array();
            this.gameState.players.forEach((player) => {
                castles = castles.concat(player.castles);
            });
            this.controls.mouseMove(target, castles, this.gameState.currentPlayerId);
        }
    }
    keyDown(e) {
        if (this.ui.state != UIStates.Menu) {
            this.ui.menu.forEach(b => {
                console.log("HELLOOO");
                if (b instanceof TextField) {
                    b.text = b.label;
                }
            });
        }
        this.ui.menu.forEach(b => {
            if (b instanceof TextField) {
                if (b.active) {
                    if (e.key.length === 1) {
                        b.text += e.key;
                    }
                    else if (e.key === 'Backspace') {
                        b.text = b.text.slice(0, -1);
                    }
                }
            }
        });
    }
    startConnection() {
        this.messageHandler.webSocketDriver.openConnection();
    }
    closeConnection() {
        this.messageHandler.webSocketDriver.closeConnection();
    }
    eventHandling() {
        this.canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
        this.canvas.addEventListener("mousemove", (e) => this.mouseMove(e));
        window.addEventListener("resize", () => this.displayDriver.resize());
        window.addEventListener("keydown", (e) => this.keyDown(e));
    }
    buildGameStateEvent(players) {
        this.gameState.buildGameState(players);
        this.ui.state = UIStates.Game;
    }
    responseAttackOrder(soldiers, money) {
        this.gameState.createSoldiers(soldiers, money);
    }
    updateGameStateEvent(updates, tick) {
        this.gameState.update(updates, tick);
    }
    setCurrentPlayerId(clientId) {
        this.gameState.setCurrentPlayerId(clientId);
    }
    gameEnd(winner) {
        this.gameState.gameEnd(winner);
    }
    sendTick() {
        const tick = {
            msgType: "ClientTick",
        };
        this.messageHandler.send(tick);
    }
    CPUcreateUnit(state, money, soldiers) {
        this.gameState.createSoldiers(soldiers, money);
    }
}
//# sourceMappingURL=events.js.map