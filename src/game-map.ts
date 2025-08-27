import { TiledRow } from './tiled-row';

/**
 * Representation of the game's map.
 */
export class GameMap {

  private ctx: CanvasRenderingContext2D;

  private rows: TiledRow[] = [];

  /*
   * Row where the player is at right now
   */
  public currentRow: TiledRow | null = null;

  public constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public generateNewMap(): void {
    const rowsAmount = 8;
    const rowHeight = this.ctx.canvas.height / rowsAmount;
    for (let i = 0; i < rowsAmount; i++) {
      const color = i % 2 === 0 ? 'gray' : 'black';
      const index = rowsAmount - i - 1;
      const tiledRow = new TiledRow(
        this.ctx,
        rowHeight,
        rowHeight * index,
        color,
      );
      this.rows.push(tiledRow);
    }
    this.currentRow = this.rows[1];
  }

  public getNextRow(): TiledRow {
    return this.rows[this.rows.length - 2];
  }

  /**
   * Method to be called when the current row must be changed
   */
  public onNextRow(row: TiledRow): void {
    const removedRow = this.rows.shift() as TiledRow;
    this.currentRow = row;
    const newRow = new TiledRow(
      this.ctx,
      row.height,
      0,
      removedRow.color,
    );
    this.rows.push(newRow);
    this.updateRowsYCoordinate();
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
