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
      const index = rowsAmount - i - 1;
      const tiledRow = new TiledRow(
        rowHeight,
        rowHeight * index,
        color,
      );
      // Do not spawn humans on rows close to the player at the start
      if (i > 3) {
        tiledRow.generateHumans();
      }
      this.rows.push(tiledRow);
    }
    this.currentRow = this.rows[1];
  }

  public getNextRow(): TiledRow {
    return this.rows[2];
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

    this.currentRow = row;
    const newRow = new TiledRow(
      row.height,
      0,
      removedRow.color,
    );
    this.rows.push(newRow);
    this.updateRowsYCoordinate();
    newRow.generateHumans();
    removedRow.destroy();
  }

  public update(): void {
    for (const row of this.rows) {
      row.render();
    }
  }

  private updateRowsYCoordinate(): void {
    for (const [i, row] of this.rows.entries()) {
      const index = this.rows.length - i - 1;
      row.y = index * row.height;
    }
  }

}
