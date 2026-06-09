import { Vector } from "./vector.js";
export var UIStates;
(function (UIStates) {
    UIStates[UIStates["Menu"] = 0] = "Menu";
    UIStates[UIStates["SessionOptions"] = 1] = "SessionOptions";
    UIStates[UIStates["Session"] = 2] = "Session";
    UIStates[UIStates["Game"] = 3] = "Game";
    UIStates[UIStates["Leaderboard"] = 4] = "Leaderboard";
    UIStates[UIStates["Matchmaking"] = 5] = "Matchmaking";
})(UIStates || (UIStates = {}));
export var ButtonEvent;
(function (ButtonEvent) {
    ButtonEvent[ButtonEvent["Matchmake"] = 0] = "Matchmake";
    ButtonEvent[ButtonEvent["Menu"] = 1] = "Menu";
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
    matchMaking;
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.menu = this.menuConstructor();
        this.matchMaking = this.matchMakingConstructor();
    }
    menuConstructor() {
        let menu = new Array();
        const matchmakingButton = new Button(this.gameWidth * 0.8, this.gameHeight * 0.2, new Vector(this.gameWidth * 0.1, this.gameHeight / 2), ButtonEvent.Matchmake, "MATCHMAKE");
        menu.push(matchmakingButton);
        return menu;
    }
    matchMakingConstructor() {
        let matchmaking = new Array();
        const matchmakingButton = new Button(this.gameWidth * 0.4, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.1, this.gameHeight / 2 * 1.1), ButtonEvent.Menu, "CANCEL");
        matchmaking.push(matchmakingButton);
        return matchmaking;
    }
}
//# sourceMappingURL=ui.js.map