import { ImageStorage } from "./image-storage";
import { Obstacle } from "./obstacle";

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

  private obstacles: Obstacle[] = [];

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

    this.generateRandomObstacles();
    this.render();
  }

  private generateRandomObstacles(): void {
    const tileSize = this.width / 8;
    const tilesAmount = Math.round(Math.random() * 2);

    for (let i = 0; i < tilesAmount; i++) {
      const obstacleNumber = Math.round(Math.random() * (ImageStorage.obstacles.length - 1));
      const obstacleImage = ImageStorage.obstacles[obstacleNumber];
      const obstacle = new Obstacle(this.ctx, tileSize * i, obstacleImage, this);
      this.obstacles.push(obstacle);
    }
  }

  public render(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, this.y, this.ctx.canvas.width, this.height);
    for (const obstacle of this.obstacles) {
      obstacle.render();
    }
  }
}

