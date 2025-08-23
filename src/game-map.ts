import { TiledRow } from "./tiled-row";

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
    // Inversed loop to render from bottom to top - will be easier to work with array later
    for (let i = 7; i >= 0; i--) {
      const color = i % 2 === 0 ? 'gray' : 'black';
      const tiledRow = new TiledRow(
        this.ctx,
        rowHeight,
        rowHeight * i,
        color,
      );
      this.rows.push(tiledRow);
    }
    this.currentRow = this.rows[0];
  }

}
