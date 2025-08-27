import { GameSettings } from "./game-settings";
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

  private obstacles: Obstacle[] = [];

  public constructor(
    height: number,
    y: number,
    color: string,
  ) {
    this.y = y;
    this.height = height;
    this.width = GameSettings.canvas.width;
    this.color = color;

    this.generateRandomObstacles();
    this.render();
  }

  private generateRandomObstacles(): void {
    const tileSize = this.width / 8;
    const tilesAmount = Math.round(Math.random() * 2);

    for (let i = 0; i < tilesAmount; i++) {
      const obstacleNumber = Math.round(Math.random() * (ImageStorage.obstacles.length - 1));
      const obstacleImage = ImageStorage.obstacles[obstacleNumber];
      const obstacle = new Obstacle(tileSize * i, obstacleImage, this);
      this.obstacles.push(obstacle);
    }
  }

  public render(): void {
    GameSettings.context.fillStyle = this.color;
    GameSettings.context.fillRect(0, this.y, GameSettings.canvas.width, this.height);
    for (const obstacle of this.obstacles) {
      obstacle.render();
    }
  }
}

