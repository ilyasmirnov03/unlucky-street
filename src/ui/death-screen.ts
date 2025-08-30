import { GameLoop } from "../core/game-loop";
import { GameMap } from "../game-map";
import { GameSettings } from "../game-settings";
import { Player } from "../player";

export class DeathScreen {

  private static container: HTMLElement;

  public static init(gameLoop: GameLoop): void {
    this.container = document.getElementById('death-screen') as HTMLElement;

    // Restart button
    this.container.querySelector('button')?.addEventListener('click', () => {
      const gameMap = new GameMap();
      const player = new Player(gameMap, gameLoop);
      this.hide();
      gameLoop.start(GameSettings.context, player, gameMap);
    });
  }

  public static show(): void {
    this.container.style.display = 'block';
  }

  public static hide(): void {
    this.container.style.display = 'none';
  }
}
