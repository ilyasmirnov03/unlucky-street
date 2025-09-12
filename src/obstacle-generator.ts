import { ImageStorage } from "./core/image-storage";
import { randomNumberBetween, shouldWithChance } from "./core/random-utils";
import { RatioedConstants } from "./core/ratioed-consts";
import { Obstacle } from "./obstacle";
import { TiledRow } from "./tiled-row";

export class ObstacleGenerator {

  /*
   * Constant pattern to generate rows from.
   * This is done to avoid paaterns that lead to the player being stuck on a row.
   */
  private patterns: [number, number, number, number, number, number, number][] = [
    [1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1],
  ]

  private currentIndex = Math.floor(randomNumberBetween(0, this.patterns.length));

  private readonly maxIndex = this.patterns.length - 1;

  public generateObstacles(row: TiledRow): void {
    const pattern = this.patterns[this.currentIndex];
    let removedObstacle = false;

    for (const [i, place] of pattern.entries()) {
      if (!place) {
        continue;
      };

      // Small chance to not generate an obstacle
      if (shouldWithChance(0.4) && !removedObstacle) {
        removedObstacle = true;
        continue;
      }

      const x = i * RatioedConstants.obstacle;
      const obstacleImage = ImageStorage.obstacles[Math.floor(Math.random() * ImageStorage.obstacles.length)];
      row.addObstacle(new Obstacle({ x, image: obstacleImage, row }));
    }

    if (this.currentIndex === this.maxIndex) {
      this.currentIndex = 0;
      this.reverseRows();
    } else {
      this.currentIndex++;
    }
  }

  private reverseRows(): void {
    for (const p of this.patterns) {
      p.reverse();
    }
  }

}

