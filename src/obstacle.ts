import { Camera } from './core/camera';
import { GameSettings } from './core/game-settings';
import { Sprite } from './core/sprite';
import { TiledRow } from './tiled-row';

interface ObstacleInterface {
  x: number;
  image: HTMLImageElement;
  row: TiledRow;
}

/**
 * Any in-game obstacle
 */
export class Obstacle extends Sprite {

  private image: HTMLImageElement;

  private row: TiledRow;

  constructor(obstacleObj: ObstacleInterface) {
    super();
    this.x = obstacleObj.x;
    this.image = obstacleObj.image;
    this.row = obstacleObj.row;
    this.spriteWidth = 96 * GameSettings.ratio;
    this.spriteHeight = 96 * GameSettings.ratio;
  }

  public render(): void {
    GameSettings.context.drawImage(
      this.image,
      0, 0, 16, 16,
      this.x, Camera.worldYToScreen(this.row.y, this.row.height), this.spriteWidth, this.spriteHeight
    );
  }
}
