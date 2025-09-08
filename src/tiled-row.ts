import { GameSettings } from "./core/game-settings";
import { Human } from "./human";
import { ImageStorage } from "./core/image-storage";
import { Obstacle } from "./obstacle";
import { randomNumberBetween, shouldWithChance, weightedRandom } from "./core/random-utils";
import { Splash } from "./ui/splash";
import { Score } from "./ui/score";
import { Sprite } from "./core/sprite";
import { RatioedConstants } from "./core/ratioed-consts";

/**
 * A row on the game map with tiles.
 * It contains randomly generated obstacles and textures.
 * Upon new tiled row generation, a few humans will spawn as well.
 */
export class TiledRow extends Sprite {

  public height: number;

  public width: number;

  private obstacles: Obstacle[] = [];

  private humans: Human[] = [];

  public constructor(
    height: number,
    y: number,
  ) {
    super();
    this.y = y;
    this.height = height;
    this.width = GameSettings.canvas.width;

    this.render(0);
  }

  public generateRandomObstacles(): void {
    const tilesAmount = Math.round(Math.random() * 2);

    for (let i = 0; i < tilesAmount; i++) {
      const obstacleNumber = Math.round(Math.random() * (ImageStorage.obstacles.length - 1));
      const obstacleImage = ImageStorage.obstacles[obstacleNumber];
      const obstacle = new Obstacle({
        x: randomNumberBetween(0, GameSettings.canvas.offsetWidth - RatioedConstants.obstacle),
        image: obstacleImage,
        row: this,
      });
      this.obstacles.push(obstacle);
    }
  }

  public isIntersectingWithAnyObstacleOnX(x: number): boolean {
    for (const obstacle of this.obstacles) {
      if (x <= obstacle.x + RatioedConstants.obstacle && x >= obstacle.x - RatioedConstants.obstacle) {
        return true;
      }
    }

    return false;
  }

  public isIntersectingWithAHuman(x: number): boolean {
    for (const human of this.humans) {
      if (x <= human.x + RatioedConstants.player && x + RatioedConstants.player >= human.x) {
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
        speed: randomNumberBetween(200, 250),
        x: Math.round(randomNumberBetween(-RatioedConstants.humanWidth, GameSettings.canvas.offsetWidth)),
      }));
    }
  }

  public checkForCrossedRoads(x: number): void {
    let crossedRoadsAmount = 0;   // how many humans are within scoring range (≤ 450px)
    let basePointsSum = 0;        // sum of per-human points before multiplier

    for (const human of this.humans) {
      console.debug('Human x coordinates at the time of crossing:', human.x);

      const dx = Math.abs(x - human.x);

      // Only award points if within 450px
      if (dx <= 450) {
        crossedRoadsAmount++;

        // Distance-based base score:
        //  - ≤150px => full 150 pts
        //  - 150..450px => linearly fall off to 0
        const basePoints =
          dx <= 150
            ? 150
            : Math.round(150 * Math.exp(-(dx - 150) / 100));

        basePointsSum += basePoints;
      }
    }

    // Apply multiplier for simultaneous crosses
    let multiplier = 1;
    if (crossedRoadsAmount === 2) {
      multiplier = 1.25;
    }
    else if (crossedRoadsAmount >= 3) {
      multiplier = 2
    };

    const totalPoints = Math.round(basePointsSum * multiplier);
    if (totalPoints > 0) {
      Splash.showForTime(
        { text: totalPoints.toString(), x, y: this.y },
        2000
      );
    }
    Score.addScore(totalPoints);
  }

  public render(dt: number): void {
    for (const obstacle of this.obstacles) {
      obstacle.render();
    }
    for (const human of this.humans) {
      human.render(dt);
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

