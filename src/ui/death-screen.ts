import { GameLoop } from "../core/game-loop";
import { GameMap } from "../game-map";
import { Player } from "../player";
import { Score } from "./score";
import { getById } from "../core/dom-utils";

export class DeathScreen {

  private static c: HTMLElement;

  public static init(gameLoop: GameLoop): void {
    this.c = getById('death-screen');

    // Restart button
    this.c.querySelector('button')?.addEventListener('click', () => {
      Score.addScore(0, true);
      const gameMap = new GameMap();
      const player = new Player(gameMap, gameLoop);
      this.hide();
      gameLoop.setLastTime();
      gameLoop.start(player, gameMap);
    });
  }

  public static show(): void {
    this.c.style.display = 'flex';
    getById('final-score').textContent = Score.getScore().toString();
  }

  public static hide(): void {
    this.c.style.display = 'none';
  }
}
