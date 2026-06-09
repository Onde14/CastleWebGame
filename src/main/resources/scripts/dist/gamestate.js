import { Soldier, Castle, Village } from "./objects.js";
import { UIStates } from "./ui.js";
import { Vector } from "./vector.js";
export var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Playing"] = 0] = "Playing";
    PlayerState[PlayerState["Defeated"] = 1] = "Defeated";
})(PlayerState || (PlayerState = {}));
export var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["Started"] = 0] = "Started";
    GameStatus[GameStatus["Ended"] = 1] = "Ended";
})(GameStatus || (GameStatus = {}));
export class Player {
    id;
    ai;
    units;
    castles;
    villages;
    color;
    state = PlayerState.Playing;
    money = 0;
    constructor(ai, id, units, castles, villages, color) {
        this.id = id;
        this.ai = ai;
        this.units = units;
        this.castles = castles;
        this.villages = villages;
        this.color = color;
    }
}
export class Gamestate {
    players = Array();
    gameObjects = new Map();
    currentPlayerId = "";
    currentPlayer = undefined;
    clock = 0;
    winner = null;
    state = GameStatus.Ended;
    ui;
    constructor(ui) {
        this.ui = ui;
    }
    setCurrentPlayerId(clientId) {
        this.currentPlayerId = clientId;
    }
    buildGameState(players) {
        this.state = GameStatus.Started;
        console.log("PLAYERS1: ", players);
        let playerArray = new Array();
        players.forEach((player) => {
            const id = player.id;
            let newPlayer = new Player(false, player.id, new Array(), new Array(), new Array(), player.color);
            player.castles.forEach((castle) => {
                let villages = new Array();
                castle.villages.forEach((village) => {
                    const newVillage = new Village(new Vector(village.pos.x, village.pos.y), village.id, village.id, village.health);
                    villages.push(newVillage);
                    this.gameObjects.set(newVillage.id, newVillage);
                });
                const newCastle = new Castle(new Vector(castle.pos.x, castle.pos.y), castle.id, castle.owner, castle.ownerColor, castle.health, castle.villages = villages, castle.connections);
                castle.villages.forEach((village) => {
                    const newVillage = new Village(new Vector(village.pos.x, village.pos.y), village.id, village.id, village.health);
                    newCastle.villages.push(newVillage);
                });
                newPlayer.castles.push(newCastle);
                this.gameObjects.set(newCastle.id, newCastle);
            });
            player.units.forEach((soldier) => {
                const newSoldier = new Soldier(new Vector(soldier.pos.x, soldier.pos.y), soldier.id, soldier.owner, soldier.ownerColor, soldier.health);
                if (soldier.target !== undefined) {
                    newSoldier.give_target(new Vector(soldier.target.x, soldier.target.y));
                }
                newPlayer.units.push(newSoldier);
                this.gameObjects.set(newSoldier.id, newSoldier);
            });
            playerArray.push(newPlayer);
            if (newPlayer.id == this.currentPlayerId) {
                this.currentPlayer = newPlayer;
                console.log("if (player.id == this.currentPlayerId): ", this.currentPlayer);
            }
        });
        this.players = playerArray;
        console.log("PLAYERS2: ", this.players);
    }
    createSoldiers(soldiers, money) {
        let moneySet = false;
        soldiers.forEach((soldier) => {
            if (moneySet == false) {
                const player = this.players.find(p => p.id == soldier.owner);
                console.log("player", player, "money", money, "soldiers", soldiers);
                player.money = money;
                moneySet = true;
            }
            //console.log("createSoldiers: 1")
            let new_soldier = new Soldier(new Vector(soldier.pos.x, soldier.pos.y), soldier.id, soldier.owner, soldier.ownerColor, soldier.health);
            //console.log("createSoldiers: 2")
            let attackerPlayer = this.players.find((player) => player.id == soldier.owner);
            //console.log("createSoldiers: 3")
            if (attackerPlayer !== undefined) {
                attackerPlayer.units.push(new_soldier);
            }
            //console.log("createSoldiers: 4")
            new_soldier.give_target(new Vector(soldier.target.x, soldier.target.y));
            this.gameObjects.set(new_soldier.id, new_soldier);
            console.log("NEW SOLDIER CREATED: ", new_soldier);
        });
    }
    update(updates, tick) {
        this.clock = Math.trunc(tick / 100);
        updates.forEach((u) => {
            if (u.money) {
                const player = this.players.find(p => p.id == u.id);
                player.money += u.money;
                return;
            }
            const object = this.gameObjects.get(u.id);
            //console.log(2, u, u, u.id, u.pos);
            if (u.state == 2) {
                // console.log(3, u.id, this.gameObjects);
                //console.log(object);
                //console.log(4);
                object.pos = new Vector(u.updatedPos.x, u.updatedPos.y);
            }
            if (u.state == 0) {
                let object = this.gameObjects.get(u.id);
                if (object instanceof Soldier) {
                    const player = this.players.find((p) => p.id == u.playerId);
                    console.log("PLAYER", player);
                    if (player !== undefined) {
                        //console.log(6, player);
                        player.units = player.units.filter((unit) => unit.id != u.id);
                        this.gameObjects.delete(u.id);
                        //console.log(6, player.units, this.gameObjects);
                    }
                    console.log("IS SOLDIER", object);
                }
                else if (object instanceof Village) {
                    console.log("IS VILLAGE", object);
                    const player = this.players.find((p) => p.id == u.playerId);
                    const castle = player.castles.find((c) => c.owner == u.playerId);
                    castle.villages = castle.villages.filter((v) => v.id != u.id);
                    this.gameObjects.delete(u.id);
                }
            }
            else {
                //console.log("ELSE: ", object)
                if (updates.length != 0)
                    console.log(1, updates);
                if (object instanceof Castle) {
                    const castleOwner = this.players.find((p) => p.id == u.playerId);
                    const castle = castleOwner.castles.find((c) => c.id == u.id);
                    if (u.health !== undefined) {
                        //console.log("castle.health",castle.health, "u.health",u.health)
                        castle.health = u.health;
                    }
                    if (u.newOwner !== undefined) {
                        //console.log("NEWOWNER: ",object)
                        const newOwner = this.players.find((p) => p.id == u.newOwner);
                        castleOwner.castles = castleOwner.castles.filter(c => c.id != u.id);
                        newOwner.castles.push(castle);
                        castle.owner = newOwner.id;
                        castle.ownerColor = newOwner.color;
                    }
                }
            }
        });
        if (this.currentPlayer?.castles.length == 0)
            this.currentPlayer.state = PlayerState.Defeated;
    }
    move_commands() {
        this.players.forEach((player) => {
            let moving_units = player.units?.filter((unit) => unit.moving == true);
            moving_units.forEach((unit, i) => {
                if (unit.has_found_target()) {
                    unit.moving = false;
                }
                else {
                    //console.log("Moving Unit", unit.unit.id, " from [", unit.unit.pos.x, ",", unit.unit.pos.y, "] to [", unit.unit.target.x, ",", unit.unit.target.y,"]")
                    unit.move_to_target();
                }
            });
        });
    }
    gameEnd(winner) {
        console.log("winner:", winner);
        const player = this.players.find(p => p.id == winner);
        this.winner = player;
        this.state = GameStatus.Ended;
        this.ui.state = UIStates.EndGame;
    }
    resetGameState() {
        this.players = Array();
        this.gameObjects = new Map();
        this.currentPlayerId = "";
        this.currentPlayer = undefined;
        this.clock = 0;
        this.winner = null;
        this.state = GameStatus.Ended;
    }
}
//# sourceMappingURL=gamestate.js.map