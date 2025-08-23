/**
 * A row on the game map with tiles.
 * It contains randomly generated obstacles and textures.
 * Upon new tiled row generation, a few humans will spawn as well.
 */
export class TiledRow {

  public y: number;

  public height: number;

  public width: number;

  public constructor(
    ctx: CanvasRenderingContext2D,
    height: number,
    y: number,
    color: string,
  ) {
    this.y = y;
    this.height = height;
    this.width = ctx.canvas.width;

    ctx.fillStyle = color;
    ctx.fillRect(0, y, ctx.canvas.width, height);
  }
}

