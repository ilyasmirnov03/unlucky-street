import { Camera } from "./camera";
import { GameMap } from "./game-map";
import { GameSettings } from "./game-settings";
import { ImageStorage } from "./image-storage";

/**
 * Class to manage player functionnality.
 */
export class Player {

  private gameMap: GameMap;

  public x = 0;

  public y = 0;

  private pressedKeys = new Set<'left' | 'right'>();

  private speed = 2;

  constructor(gameMap: GameMap) {
    this.gameMap = gameMap;

    // Center player model
    if (gameMap.currentRow != null) {
      this.x = gameMap.currentRow.width / 2 - 50;
      this.y = gameMap.currentRow.y; //+ gameMap.currentRow.height / 2 - 50;
    }
    console.debug('Initial player coordinates:', this.x, this.y);

    document.body.addEventListener('keydown', (e) => {
      this.handleDownKey(e);
    });

    document.body.addEventListener('keyup', (e) => {
      this.handleUpKey(e);
    });

    this.render();
  }

  public render(): void {
    const img = ImageStorage.playerImages.get('back-cat') as HTMLImageElement;
    const sideImg = ImageStorage.playerImages.get('side-cat') as HTMLImageElement;
    const spriteW = 96;
    const spriteH = 96;
    const y = Camera.worldYToScreen(this.y, 100);

    GameSettings.context.save();

    if (this.pressedKeys.has('left')) {
      GameSettings.context.scale(-1, 1);
      GameSettings.context.drawImage(sideImg, 0, 0, 16, 16, -this.x - spriteW, y, spriteW, spriteH);
    } else if (this.pressedKeys.has('right')) {
      GameSettings.context.drawImage(sideImg, 0, 0, 16, 16, this.x, y, spriteW, spriteH);
    } else {
      GameSettings.context.drawImage(img, 0, 0, 16, 16, this.x, y, spriteW, spriteH);
    }

    GameSettings.context.restore();
  }

  public update(): void {
    let dx = 0;

    if (this.pressedKeys.has('left')) {
      dx -= 1;
    } else if (this.pressedKeys.has('right')) {
      dx += 1;
    }

    const nextX = this.x + dx * this.speed;

    const isIntersectingWithObstacles = this.gameMap.currentRow?.isIntersectingWithAnyObstacleOnX(nextX);

    // Screen collisions
    if (
      (nextX >= 0 && nextX <= GameSettings.canvas.offsetWidth - 100) &&
      !isIntersectingWithObstacles
    ) {
      this.x = nextX;
    }

    this.render();
  }

  private goToNextRow(): void {
    this.gameMap.onNextRow(this, this.gameMap.getNextRow());
  }

  private handleDownKey(e: KeyboardEvent): void {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.goToNextRow();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.pressedKeys.add('left');
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.pressedKeys.add('right');
        break;
    }
  }

  private handleUpKey(e: KeyboardEvent): void {
    switch (e.code) {
      case 'KeyA':
      case 'ArrowLeft':
        this.pressedKeys.delete('left');
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.pressedKeys.delete('right');
        break;
    }
  }
}
