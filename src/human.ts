import { Camera } from "./core/camera";
import { GameSettings } from "./core/game-settings";
import { ImageStorage } from "./core/image-storage";
import { randomNumberBetween } from "./core/random-utils";
import { RatioedConstants } from "./core/ratioed-consts";
import { Sprite } from "./core/sprite";
import { TiledRow } from "./tiled-row";

interface HumanInterface {
  row: TiledRow;

  /**
   * Direciton (where they're looking)
   */
  d: -1 | 1;

  /**
   * Speed
   */
  s: number;
  x: number;
}

/**
 * Human behavior
 */
export class Human extends Sprite {

  /**
   * Movement direction where -1 is left and 1 is right
   */
  public direction: -1 | 1;

  public row: TiledRow;

  /**
   * Human's speed
   */
  private s: number;

  private directionDecisionInterval: number;

  private isLocked = false;

  private hat: HTMLImageElement;

  public constructor(humanObj: HumanInterface) {
    super();
    this.row = humanObj.row;
    this.direction = humanObj.d;
    this.s = humanObj.s * GameSettings.ratio;
    this.x = humanObj.x;

    this.hat = ImageStorage.humanImages.get(`hat${Math.round(randomNumberBetween(1, 4))}`) as HTMLImageElement;

    console.debug('Human generated with info: ', humanObj);

    this.directionDecisionInterval = setInterval(this.updateDirection.bind(this), 750);
  }

  private updateDirection(): void {
    const shouldStay = Math.random() >= 0.6;
    if (shouldStay) {
      this.isLocked = true;

      // Stay for at least two seconds
      setTimeout(() => {
        this.isLocked = false;
      }, 2000);
      return;
    }

    const shouldMoveLeft = Math.random() >= 0.5;
    if (shouldMoveLeft) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }
  }

  private update(dt: number): void {
    if (this.isLocked) {
      return;
    }

    const nextX = this.x + this.direction * this.s * dt;

    // Screen collisions
    if (nextX >= -this.spriteWidth && nextX <= GameSettings.c.offsetWidth) {
      this.x = nextX;
    }
  }

  public render(dt: number): void {
    this.update(dt);

    const img = ImageStorage.humanImages.get('human') as HTMLImageElement;
    this.spriteWidth = RatioedConstants.humanWidth;
    this.spriteHeight = RatioedConstants.humanHeight;
    const y = Camera.worldYToScreen(this.row.y, this.row.height) - 20;

    GameSettings.ctx.save();

    if (this.direction === -1) {
      GameSettings.ctx.scale(-1, 1);
      GameSettings.ctx.drawImage(img, 0, 0, 16, 32, -this.x - this.spriteWidth, y, this.spriteWidth, this.spriteHeight);
      GameSettings.ctx.drawImage(this.hat, 0, 0, 16, 32, -this.x - this.spriteWidth, y, this.spriteWidth, this.spriteHeight);
    } else {
      GameSettings.ctx.drawImage(img, 0, 0, 16, 32, this.x, y, this.spriteWidth, this.spriteHeight);
      GameSettings.ctx.drawImage(this.hat, 0, 0, 16, 32, this.x, y, this.spriteWidth, this.spriteHeight);
    }

    GameSettings.ctx.restore();
  }

  public onDestroy(): void {
    clearInterval(this.directionDecisionInterval);
  }
}
