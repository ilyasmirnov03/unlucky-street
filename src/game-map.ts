import { Camera } from './camera';
import { GameSettings } from './game-settings';
import { Player } from './player';
import { TiledRow } from './tiled-row';

/**
 * Representation of the game's map.
 */
export class GameMap {

  private rows: TiledRow[] = [];

  /*
   * Row where the player is at right now
   */
  public currentRow: TiledRow | null = null;

  public generateNewMap(): void {
    const rowsAmount = 8;
    const rowHeight = GameSettings.canvas.height / rowsAmount;
    for (let i = 0; i < rowsAmount; i++) {
      const color = i % 2 === 0 ? 'gray' : 'black';
      const tiledRow = new TiledRow(
        rowHeight,
        rowHeight * i,
        color,
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

  public getNextRow(): TiledRow {
    return this.rows[1];
  }

  /**
   * Method to be called when the current row must be changed
   */
  public onNextRow(player: Player, row: TiledRow): void {
    console.debug('Going to next row:', row);
    const isIntersecting = row.isIntersectingWithAnyObstacleOnX(player.x);
    console.debug('Is player intersecting with obstacles on next row?', isIntersecting);
    if (isIntersecting) {
      return;
    }

    const removedRow = this.rows.shift() as TiledRow;
    this.rows[0].checkForCrossedRoads(player.x);

    const highestRow = this.rows[this.rows.length - 1];
    const newRowY = highestRow.y + highestRow.height;
    const newRow = new TiledRow(highestRow.height, newRowY, removedRow.color);
    Camera.y = newRowY + row.height;

    this.currentRow = row;
    player.y = row.y;
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
