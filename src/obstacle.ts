import { TiledRow } from './tiled-row';

/**
 * Any in-game obstacle
 */
export class Obstacle {

  private ctx: CanvasRenderingContext2D;

  private x: number;

  private image: HTMLImageElement;

  private row: TiledRow;

  constructor(ctx: CanvasRenderingContext2D, x: number, image: HTMLImageElement, tiledRow: TiledRow) {
    this.ctx = ctx;
    this.x = x;
    this.image = image;
    this.row = tiledRow;
  }

  public render(): void {
    this.ctx.drawImage(
      this.image,
      0, 0, 16, 16,
      this.x, this.row.y, 96, 96
    );
  }
}
