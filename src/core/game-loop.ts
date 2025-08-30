import { GameMap } from "../game-map";
import { Player } from "../player";
import { Splash } from "../ui/splash";

export class GameLoop {

  private canceled = false;

  public start(ctx: CanvasRenderingContext2D, player: Player, gameMap: GameMap): void {
    if (this.canceled) { // I wish I knew a better way...
      player.destroy();
      this.canceled = false; // auto-reset
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    gameMap.update();
    player.update();
    Splash.update();

    requestAnimationFrame(this.start.bind(this, ctx, player, gameMap));
  }

  public stop(): void {
    this.canceled = true;
  }

}
