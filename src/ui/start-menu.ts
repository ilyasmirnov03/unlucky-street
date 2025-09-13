import { getById } from "../core/dom-utils";
import { GameLoop } from "../core/game-loop";
import { GameMap } from "../game-map";
import { Player } from "../player";
import { Tutorial } from "./tutorial";

export class StartMenu {

  private static c: HTMLElement;

  public static init(gameLoop: GameLoop): void {
    this.c = getById('start-menu');

    // Initial map settings with initial render
    const gameMap = new GameMap();
    const player = new Player(gameMap, gameLoop);
    player.render();
    gameMap.update(0);
    const tutorialStarter = new Tutorial().init(gameMap, player, gameLoop);

    // Start
    getById('s').addEventListener('click', () => {
      this.hide();
      gameLoop.setLastTime();
      gameLoop.start(player, gameMap);
    });

    // Tutorial
    getById('t-b').addEventListener('click', () => {
      tutorialStarter.start();
      this.hide();
    });
  }

  public static show(): void {
    this.c.style.display = 'flex';
  }

  public static hide(): void {
    this.c.style.display = 'none';
  }
}

