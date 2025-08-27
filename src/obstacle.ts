import { GameSettings } from './game-settings';
import { TiledRow } from './tiled-row';

/**
 * Any in-game obstacle
 */
export class Obstacle {

  private x: number;

  private image: HTMLImageElement;

  private row: TiledRow;

  constructor(x: number, image: HTMLImageElement, tiledRow: TiledRow) {
    this.x = x;
    this.image = image;
    this.row = tiledRow;
  }

  public render(): void {
    GameSettings.context.drawImage(
      this.image,
      0, 0, 16, 16,
      this.x, this.row.y, 96, 96
    );
  }
}
