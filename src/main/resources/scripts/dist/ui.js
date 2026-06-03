var UIStates;
(function (UIStates) {
    UIStates[UIStates["Menu"] = 0] = "Menu";
    UIStates[UIStates["SessionOptions"] = 1] = "SessionOptions";
    UIStates[UIStates["Session"] = 2] = "Session";
    UIStates[UIStates["Game"] = 3] = "Game";
    UIStates[UIStates["Leaderboard"] = 4] = "Leaderboard";
})(UIStates || (UIStates = {}));
export class UserInterface {
    state = UIStates.Menu;
    constructor() { }
}
//# sourceMappingURL=ui.js.map