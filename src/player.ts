import { GameMap } from "./game-map";

/**
 * Class to manage player functionnality.
 */
export class Player {

  private ctx: CanvasRenderingContext2D;

  private gameMap: GameMap;

  public x = 0;

  public y = 0;

  private pressedKeys = new Set<'left' | 'right'>();

  private speed = 2;

  constructor(
    ctx: CanvasRenderingContext2D,
    gameMap: GameMap,
  ) {
    this.ctx = ctx;
    this.gameMap = gameMap;

    // Center player model
    if (gameMap.currentRow != null) {
      this.x = gameMap.currentRow.width / 2 - 50;
      this.y = gameMap.currentRow.y + gameMap.currentRow.height / 2 - 50;
    }


    document.body.addEventListener('keydown', (e) => {
      this.handleDownKey(e);
    });

    document.body.addEventListener('keyup', (e) => {
      this.handleUpKey(e);
    });

    this.render();
  }

  public render(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(this.x, this.y, 100, 100);
  }

  public update(): void {
    let dx = 0;

    if (this.pressedKeys.has('left')) {
      dx -= 1;
    }
    if (this.pressedKeys.has('right')) {
      dx += 1;
    }

    const nextX = this.x + dx * this.speed;

    // Screen collisions
    if (nextX >= 0 && nextX <= this.ctx.canvas.offsetWidth - 100) {
      this.x = nextX;
    }

    this.render();
  }

  private goToNextRow(): void {
    this.gameMap.onNextRow(this.gameMap.getNextRow());
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
