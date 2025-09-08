import { GameMap } from "../game-map";
import { Player } from "../player";
import { Splash } from "../ui/splash";

export class GameLoop {

  private canceled = false;

  private lastTime = performance.now();

  public setLastTime(): void {
    this.lastTime = performance.now();
  }

  public start(ctx: CanvasRenderingContext2D, player: Player, gameMap: GameMap, currentTime = 0): void {
    if (this.canceled) { // I wish I knew a better way...
      player.destroy();
      this.canceled = false; // auto-reset
      return;
    }

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    gameMap.update(dt);
    player.update(dt);
    Splash.update();

    requestAnimationFrame(this.start.bind(this, ctx, player, gameMap));
  }

  public stop(): void {
    this.canceled = true;
  }

}
