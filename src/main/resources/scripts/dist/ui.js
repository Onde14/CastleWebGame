import { Vector } from "./vector.js";
export var UIStates;
(function (UIStates) {
    UIStates[UIStates["Menu"] = 0] = "Menu";
    UIStates[UIStates["SessionOptions"] = 1] = "SessionOptions";
    UIStates[UIStates["Session"] = 2] = "Session";
    UIStates[UIStates["Game"] = 3] = "Game";
    UIStates[UIStates["Leaderboard"] = 4] = "Leaderboard";
})(UIStates || (UIStates = {}));
var ButtonEvent;
(function (ButtonEvent) {
    ButtonEvent[ButtonEvent["Matchmake"] = 0] = "Matchmake";
})(ButtonEvent || (ButtonEvent = {}));
export class Button {
    width;
    height;
    pos;
    event;
    text;
    constructor(width, height, pos, event, text) {
        this.width = width;
        this.height = height;
        this.pos = pos;
        this.event = event;
        this.text = text;
    }
}
export class UserInterface {
    gameWidth;
    gameHeight;
    state = UIStates.Menu;
    menu;
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.menu = this.menuConstruction();
    }
    menuConstruction() {
        let menu = new Array();
        const matchmakingButton = new Button(this.gameWidth * 0.8, this.gameHeight * 0.2, new Vector(this.gameWidth * 0.1, this.gameHeight / 2), ButtonEvent.Matchmake, "MATCHMAKE");
        menu.push(matchmakingButton);
        return menu;
    }
}
//# sourceMappingURL=ui.js.map