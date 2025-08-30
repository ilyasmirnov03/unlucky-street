import { Camera } from './core/camera';
import { GameSettings } from './core/game-settings';
import { Player } from './player';
import { TiledRow } from './tiled-row';

/**
 * Representation of the game's map.
 */
export class GameMap {

  private rows: TiledRow[];

  /*
   * Row where the player is at right now
   */
  public currentRow: TiledRow | null = null;

  /*
   * Index of the row to go to
   */
  private nextRowIndex = 1;

  public constructor() {
    this.rows = [];

    const rowsAmount = 8;
    const rowHeight = GameSettings.canvas.height / rowsAmount;
    for (let i = 0; i < rowsAmount; i++) {
      const tiledRow = new TiledRow(
        rowHeight,
        rowHeight * i,
      );
      // Do not spawn humans on rows close to the player at the start
      if (i > 3) {
        tiledRow.generateHumans();
      }
      this.rows.push(tiledRow);
    }
    this.currentRow = this.rows[0];
    Camera.y = GameSettings.canvas.height;

    console.debug('Map generated with rows:', this.rows);
  }

  /**
   * Method to be called when the current row must be changed
   */
  public onNextRow(player: Player): void {
    const row = this.rows[this.nextRowIndex];
    console.debug('Going to next row:', row);

    const isIntersecting = row.isIntersectingWithAnyObstacleOnX(player.x);
    console.debug('Is player intersecting with obstacles on next row?', isIntersecting);
    if (isIntersecting) {
      return;
    }

    this.currentRow = row;
    player.y = row.y;

    if (this.nextRowIndex < 4) {
      this.nextRowIndex++;
      return;
    }

    const previousRow = this.rows[this.nextRowIndex - 1];
    if (previousRow != null) {
      previousRow.checkForCrossedRoads(player.x);
    }
    const removedRow = this.rows.shift() as TiledRow;

    const highestRow = this.rows[this.rows.length - 1];
    const newRowY = highestRow.y + highestRow.height;
    const newRow = new TiledRow(highestRow.height, newRowY);
    Camera.y = newRowY + row.height;

    this.rows.push(newRow);
    newRow.generateHumans();
    removedRow.destroy();
  }

  public update(): void {
    for (const row of this.rows) {
      row.render();
    }
  }

}
