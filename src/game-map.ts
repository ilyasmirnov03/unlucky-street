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
    const rowHeight = this.ctx.canvas.height / 8;
    for (let i = 0; i < 8; i++) {
      const color = i % 2 === 0 ? 'gray' : 'black';
      const tiledRow = new TiledRow(
        this.ctx,
        rowHeight,
        rowHeight * i,
        color,
      );
      this.rows.push(tiledRow);
    }
    this.currentRow = this.rows[this.rows.length - 1];
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
      row.y = i * row.height;
    }
  }

}
