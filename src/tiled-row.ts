/**
 * A row on the game map with tiles.
 * It contains randomly generated obstacles and textures.
 * Upon new tiled row generation, a few humans will spawn as well.
 */
export class TiledRow {

  public y: number;

  public height: number;

  public width: number;

  public color: string;

  private ctx: CanvasRenderingContext2D;

  public constructor(
    ctx: CanvasRenderingContext2D,
    height: number,
    y: number,
    color: string,
  ) {
    this.y = y;
    this.height = height;
    this.width = ctx.canvas.width;
    this.color = color;
    this.ctx = ctx;

    this.render();
  }

  public render(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, this.y, this.ctx.canvas.width, this.height);
  }
}

