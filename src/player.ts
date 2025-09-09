import { Camera } from "./core/camera";
import { GameLoop } from "./core/game-loop";
import { GameMap } from "./game-map";
import { GameSettings } from "./core/game-settings";
import { ImageStorage } from "./core/image-storage";
import { DeathScreen } from "./ui/death-screen";
import { LivesUi } from "./ui/lives";
import { MobileControls } from "./core/mobile-controls";
import { Sprite } from "./core/sprite";
import { RatioedConstants } from "./core/ratioed-consts";

/**
 * Class to manage player functionnality.
 */
export class Player extends Sprite {

  public gameMap: GameMap;

  private gameLoop: GameLoop;

  private pressedKeys = new Set<'left' | 'right'>();

  private speed = 250 * GameSettings.ratio;

  private isInvincible = false;

  private lives = 9;

  private downKeyHandlerRef: any;

  private upKeyHandlerRef: any;

  private invincibleAnimationInterval: number;

  /**
   * Player's alpha state, used for invincibility animation
   */
  private alpha = 1;

  constructor(gameMap: GameMap, gameLoop: GameLoop) {
    super();
    this.gameMap = gameMap;
    this.gameLoop = gameLoop;

    this.spriteWidth = RatioedConstants.player;
    this.spriteHeight = RatioedConstants.player;

    // Center player model
    if (gameMap.currentRow != null) {
      this.x = gameMap.currentRow.width / 2 - (this.spriteWidth / 2);
      this.y = gameMap.currentRow.y; //+ gameMap.currentRow.height / 2 - 50;
    }
    console.debug('Initial player coordinates:', this.x, this.y);

    MobileControls.addHandlers(
      this.handlePointerDown.bind(this),
      this.handlePointerUp.bind(this),
    );

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
    const y = Camera.worldYToScreen(this.y, this.spriteHeight);

    GameSettings.context.save();

    GameSettings.context.globalAlpha = this.alpha;

    if (this.pressedKeys.has('left')) {
      GameSettings.context.scale(-1, 1);
      GameSettings.context.drawImage(sideImg, 0, 0, 16, 16, -this.x - this.spriteWidth, y, this.spriteWidth, this.spriteHeight);
    } else if (this.pressedKeys.has('right')) {
      GameSettings.context.drawImage(sideImg, 0, 0, 16, 16, this.x, y, this.spriteHeight, this.spriteHeight);
    } else {
      GameSettings.context.drawImage(img, 0, 0, 16, 16, this.x, y, this.spriteWidth, this.spriteHeight);
    }

    GameSettings.context.restore();
  }

  public update(dt: number): void {
    let dx = 0;

    if (this.pressedKeys.has('left')) {
      dx -= 1;
    } else if (this.pressedKeys.has('right')) {
      dx += 1;
    }

    const nextX = this.x + dx * this.speed * dt;

    const isIntersectingWithObstacles = this.gameMap.currentRow?.isIntersectingWithAnyObstacleOnX(nextX);

    // Screen collisions
    if (
      (nextX >= 0 && nextX <= GameSettings.canvas.offsetWidth - this.spriteWidth) &&
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
      this.setupInvincibleAnimation();
      setTimeout(() => {
        this.alpha = 1;
        this.isInvincible = false
        clearInterval(this.invincibleAnimationInterval);
      }, 1000);
    }

    this.render();
  }

  public destroy(): void {
    document.body.removeEventListener('keydown', this.downKeyHandlerRef);
    document.body.removeEventListener('keyup', this.upKeyHandlerRef);
    MobileControls.removeHandlers();
  }

  private setupInvincibleAnimation(): void {
    let factor = -0.5;
    this.invincibleAnimationInterval = setInterval(() => {
      this.alpha += factor;
      factor *= -1;
    }, 100);
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
