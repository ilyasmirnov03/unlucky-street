import { GameLoop } from "../core/game-loop";
import { GameMap } from "../game-map";
import { GameSettings } from "../core/game-settings";
import { Player } from "../player";
import { Score } from "./score";
import { getById } from "../core/dom-utils";

export class DeathScreen {

  private static container: HTMLElement;

  public static init(gameLoop: GameLoop): void {
    this.container = getById('death-screen');

    // Restart button
    this.container.querySelector('button')?.addEventListener('click', () => {
      Score.addScore(0, true);
      const gameMap = new GameMap();
      const player = new Player(gameMap, gameLoop);
      this.hide();
      gameLoop.start(GameSettings.context, player, gameMap);
    });
  }

  public static show(): void {
    this.container.style.display = 'flex';
    getById('final-score').textContent = Score.getScore().toString();
  }

  public static hide(): void {
    this.container.style.display = 'none';
  }
}
