enum UIStates {
  Menu,
  SessionOptions,
  Session,
  Game,
  Leaderboard,
}

export class UserInterface {
  state = UIStates.Menu;
  constructor() {}
}
