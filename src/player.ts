import { Camera } from "./core/camera";
import { GameLoop } from "./core/game-loop";
import { GameMap } from "./game-map";
import { GameSettings } from "./core/game-settings";
import { ImageStorage } from "./core/image-storage";
import { DeathScreen } from "./ui/death-screen";
import { LivesUi } from "./ui/lives";
import { getById } from "./core/dom-utils";

/**
 * Class to manage player functionnality.
 */
export class Player {

  public gameMap: GameMap;

  private gameLoop: GameLoop;

  public x = 0;

  public y = 0;

  private pressedKeys = new Set<'left' | 'right'>();

  private speed = 2;

  private isInvincible = false;

  private lives = 9;

  private downKeyHandlerRef: any;

  private upKeyHandlerRef: any;

  private pointerDownHandlerRef: any;

  private pointerUpHandlerRef: any;

  constructor(gameMap: GameMap, gameLoop: GameLoop) {
    this.gameMap = gameMap;
    this.gameLoop = gameLoop;

    // Center player model
    if (gameMap.currentRow != null) {
      this.x = gameMap.currentRow.width / 2 - 50;
      this.y = gameMap.currentRow.y; //+ gameMap.currentRow.height / 2 - 50;
    }
    console.debug('Initial player coordinates:', this.x, this.y);

    const mobileControls = getById('mobile').children;
    this.pointerDownHandlerRef = this.handlePointerDown.bind(this);
    this.pointerUpHandlerRef = this.handlePointerUp.bind(this);
    for (const child of mobileControls) {
      child.addEventListener('pointerdown', this.pointerDownHandlerRef);
      child.addEventListener('pointerup', this.pointerUpHandlerRef);
    }

    this.downKeyHandlerRef = this.handleDownKey.bind(this);
    this.upKeyHandlerRef = this.handleUpKey.bind(this);

    document.body.addEventListener('keydown', this.downKeyHandlerRef);
    document.body.addEventListener('keyup', this.upKeyHandlerRef);

    LivesUi.renderLives(this.lives);

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

    if (!this.isInvincible && this.gameMap.currentRow?.isIntersectingWithAHuman(this.x)) {
      this.lives--;
      if (this.lives === 0) {
        this.gameLoop.stop();
        DeathScreen.show();
      }
      LivesUi.renderLives(this.lives);
      this.isInvincible = true;
      setTimeout(() => this.isInvincible = false, 1000);
    }

    this.render();
  }

  public destroy(): void {
    document.body.removeEventListener('keydown', this.downKeyHandlerRef);
    document.body.removeEventListener('keyup', this.upKeyHandlerRef);
  }

  private goToNextRow(): void {
    this.gameMap.onNextRow(this);
  }

  private handlePointerUp(): void {
    this.pressedKeys.delete('left');
    this.pressedKeys.delete('right');
  }

  private handlePointerDown(e: PointerEvent): void {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    if (e.target.id === 'left') {
      this.pressedKeys.add('left');
    } else if (e.target.id === 'right') {
      this.pressedKeys.add('right');
    } else if (e.target.id === 'center') {
      this.goToNextRow();
    }
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
