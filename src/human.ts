import { Camera } from "./camera";
import { GameSettings } from "./game-settings";
import { ImageStorage } from "./image-storage";
import { randomNumberBetween } from "./random-utils";
import { TiledRow } from "./tiled-row";

interface HumanInterface {
  row: TiledRow;
  direction: -1 | 1;
  speed: number;
  x: number;
}

/**
 * Human behavior
 */
export class Human {

  public x: number;

  /**
   * Movement direction where -1 is left and 1 is right
   */
  private direction: -1 | 1;

  public row: TiledRow;

  private speed: number;

  private directionDecisionInterval: number;

  private isLocked = false;

  private hat: HTMLImageElement;

  public constructor(humanObj: HumanInterface) {
    this.row = humanObj.row;
    this.direction = humanObj.direction;
    this.speed = humanObj.speed;
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

  private update(): void {
    if (this.isLocked) {
      return;
    }

    const nextX = this.x + this.direction * this.speed;

    // Screen collisions
    if (nextX >= -96 && nextX <= GameSettings.canvas.offsetWidth) {
      this.x = nextX;
    }
  }

  public render(): void {
    this.update();

    const img = ImageStorage.humanImages.get('human') as HTMLImageElement;
    const spriteW = 80;
    const spriteH = 160;
    const y = Camera.worldYToScreen(this.row.y, this.row.height) - 20;

    GameSettings.context.save();

    if (this.direction === -1) {
      GameSettings.context.scale(-1, 1);
      GameSettings.context.drawImage(img, 0, 0, 16, 32, -this.x - spriteW, y, spriteW, spriteH);
      GameSettings.context.drawImage(this.hat, 0, 0, 16, 32, -this.x - spriteW, y, spriteW, spriteH);
    } else {
      GameSettings.context.drawImage(img, 0, 0, 16, 32, this.x, y, spriteW, spriteH);
      GameSettings.context.drawImage(this.hat, 0, 0, 16, 32, this.x, y, spriteW, spriteH);
    }

    GameSettings.context.restore();
  }

  public onDestroy(): void {
    clearInterval(this.directionDecisionInterval);
  }
}
