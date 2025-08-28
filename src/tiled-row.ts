import { Camera } from "./camera";
import { GameSettings } from "./game-settings";
import { Human } from "./human";
import { ImageStorage } from "./image-storage";
import { Obstacle } from "./obstacle";
import { randomNumberBetween, shouldWithChance, weightedRandom } from "./random-utils";
import { Splash } from "./ui/splash";

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

  private humans: Human[] = [];

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
    const tilesAmount = Math.round(Math.random() * 2);

    for (let i = 0; i < tilesAmount; i++) {
      const obstacleNumber = Math.round(Math.random() * (ImageStorage.obstacles.length - 1));
      const obstacleImage = ImageStorage.obstacles[obstacleNumber];
      const obstacle = new Obstacle({
        x: randomNumberBetween(0, GameSettings.canvas.offsetWidth - 96),
        image: obstacleImage,
        row: this,
      });
      this.obstacles.push(obstacle);
    }
  }

  public isIntersectingWithAnyObstacleOnX(x: number): boolean {
    for (const obstacle of this.obstacles) {
      if (x <= obstacle.x + 96 && x >= obstacle.x - 96) {
        return true;
      }
    }

    return false;
  }

  public generateHumans(): void {
    const weights = {
      1: 0.5,
      2: 0.3,
      3: 0.2,
    }
    const humansAmount = weightedRandom(weights);

    for (let i = 0; i < humansAmount; i++) {
      this.humans.push(new Human({
        row: this,
        direction: shouldWithChance(0.5) ? -1 : 1,
        speed: randomNumberBetween(1, 2),
        x: Math.round(randomNumberBetween(-96, GameSettings.canvas.offsetWidth)),
      }));
    }
  }

  public checkForCrossedRoads(x: number): void {
    for (const human of this.humans) {
      console.debug('Human x coordinates at the time of crossing:', human.x);

      // Close cross, maximum points
      if (x <= human.x + 150 && x >= human.x - 150) {
        console.debug('Displaying text at:', human.x, human.row.y);
        const y = Camera.worldYToScreen(human.row.y, 0);
        Splash.showForTime({
          text: 'Crossed road!',
          x: human.x,
          y,
        }, 2000);
      }
    }
  }

  public render(): void {
    const y = -this.y + Camera.y - this.height;

    GameSettings.context.fillStyle = this.color;
    GameSettings.context.fillRect(0, y, GameSettings.canvas.width, this.height);
    for (const obstacle of this.obstacles) {
      obstacle.render();
    }
    for (const human of this.humans) {
      human.render();
    }
  }

  /**
   * Clear the object
   */
  public destroy(): void {
    for (const h of this.humans) {
      h.onDestroy();
    }
  }
}

