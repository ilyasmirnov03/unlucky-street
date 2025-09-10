import { Camera } from "../core/camera";
import { GameSettings } from "../core/game-settings";

export interface SplashText {
  text: string;
  x: number;
  y: number;
}

/**
 * Class to manage splash screens
 */
export class Splash {

  private static splashes = new Set<SplashText>();

  public static update(): void {
    for (const splash of this.splashes) {
      GameSettings.ctx.fillStyle = '#FFF';
      GameSettings.ctx.fillText(splash.text, splash.x, Camera.worldYToScreen(splash.y, 0));
    }
  }

  public static showForTime(splash: SplashText, time: number): void {
    this.splashes.add(splash);
    setTimeout(() => {
      this.splashes.delete(splash)
    }, time);
  }
}
