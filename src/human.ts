import { Camera } from "./camera";
import { GameSettings } from "./game-settings";
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

  public constructor(humanObj: HumanInterface) {
    this.row = humanObj.row;
    this.direction = humanObj.direction;
    this.speed = humanObj.speed;
    this.x = humanObj.x;

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
    GameSettings.context.fillStyle = 'white';
    GameSettings.context.fillRect(
      this.x,
      Camera.worldYToScreen(this.row.y, this.row.height),
      96,
      128
    );
  }

  public onDestroy(): void {
    clearInterval(this.directionDecisionInterval);
  }
}
