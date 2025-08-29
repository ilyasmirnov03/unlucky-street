import { GameSettings } from "../game-settings";

export class LivesUi {

  public static renderLives(lives: number): void {
    GameSettings.uiContext.clearRect(0, 0, GameSettings.uiCanvas.width, GameSettings.uiCanvas.height);
    GameSettings.uiContext.fillStyle = '#FFF';
    GameSettings.uiContext.fillText(lives.toString(), 15, 30);
  }
}
