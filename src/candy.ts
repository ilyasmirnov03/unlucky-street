import { Camera } from "./core/camera";
import { GameSettings } from "./core/game-settings";
import { ImageStorage } from "./core/image-storage";
import { Sprite } from "./core/sprite"
import { TiledRow } from "./tiled-row";


export class Candy extends Sprite {

  private image = ImageStorage.candy.get('fish') as HTMLImageElement;

  private row: TiledRow;

  private startY: number;
  private elapsed = 0;
  private duration = 0.4;

  public constructor(x: number, y: number, row: TiledRow) {
    super();
    this.x = x;
    this.startY = y;
    this.y = y;
    this.row = row;

    console.debug('[CANDY] A candy appears at (x, y)', x, y);

    this.spriteWidth = 32 * GameSettings.ratio;
    this.spriteHeight = 24 * GameSettings.ratio;
  }

  public render(dt: number): void {
    if (this.elapsed < this.duration) {
      this.elapsed += dt;
      const t = Math.min(this.elapsed / this.duration, 1);
      this.y = this.startY + (this.row.y - this.startY) * t;
    } else {
      this.y = this.row.y;
    }

    const screenY = Camera.worldYToScreen(
      this.row.y - this.row.height / 2,
      this.row.height
    );

    const yOffset = this.y - this.row.y;

    GameSettings.ctx.drawImage(
      this.image,
      0, 0, 8, 5,
      this.x,
      screenY + yOffset,
      this.spriteWidth,
      this.spriteHeight
    );
  }
}
