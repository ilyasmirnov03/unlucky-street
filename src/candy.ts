import { Camera } from "./core/camera";
import { GameSettings } from "./core/game-settings";
import { ImageStorage } from "./core/image-storage";
import { Sprite } from "./core/sprite"
import { TiledRow } from "./tiled-row";

export class Candy extends Sprite {

  private image = ImageStorage.candy.get('fish') as HTMLImageElement;

  private row: TiledRow;

  public constructor(x: number, row: TiledRow) {
    super();
    this.x = x;
    this.row = row;
    this.spriteWidth = 32 * GameSettings.ratio;
    this.spriteHeight = 24 * GameSettings.ratio;
  }

  public render(): void {
    GameSettings.ctx.drawImage(
      this.image,
      0, 0, 8, 5,
      this.x, Camera.worldYToScreen(this.row.y - this.row.height / 2, this.row.height), this.spriteWidth, this.spriteHeight
    );
  }
}

