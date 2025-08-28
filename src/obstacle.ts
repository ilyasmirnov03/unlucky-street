import { Camera } from './camera';
import { GameSettings } from './game-settings';
import { TiledRow } from './tiled-row';

interface ObstacleInterface {
  x: number;
  image: HTMLImageElement;
  row: TiledRow;
}

/**
 * Any in-game obstacle
 */
export class Obstacle {

  public x: number;

  private image: HTMLImageElement;

  private row: TiledRow;

  constructor(obstacleObj: ObstacleInterface) {
    this.x = obstacleObj.x;
    this.image = obstacleObj.image;
    this.row = obstacleObj.row;
  }

  public render(): void {
    GameSettings.context.drawImage(
      this.image,
      0, 0, 16, 16,
      this.x, Camera.worldYToScreen(this.row.y, this.row.height), 96, 96
    );
  }
}
