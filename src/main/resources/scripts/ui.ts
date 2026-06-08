import { Vector } from "./vector.js";

export enum UIStates {
  Menu,
  SessionOptions,
  Session,
  Game,
  Leaderboard,
}

enum ButtonEvent {
  Matchmake,
}

export class Button {
  width: number;
  height: number;
  pos: Vector;
  event: ButtonEvent;
  text: string;
  constructor(width: number, height: number, pos: Vector, event: ButtonEvent, text: string) {
    this.width = width;
    this.height = height;
    this.pos = pos;
    this.event = event;
    this.text = text;
  }
}

export class UserInterface {
  gameWidth: number;
  gameHeight: number;
  state = UIStates.Menu;
  menu: Array<Button>;
  constructor(gameWidth: number, gameHeight: number) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.menu = this.menuConstruction();
  }

  menuConstruction() {
    let menu = new Array<Button>();
    const matchmakingButton = new Button(this.gameWidth * 0.8,
      this.gameHeight * 0.2,
      new Vector(this.gameWidth * 0.1,this.gameHeight / 2),
      ButtonEvent.Matchmake,
      "MATCHMAKE")
    menu.push(matchmakingButton)
    return menu;
  }

}
