import { GameSettings } from "./core/game-settings";
import { Human } from "./human";
import { ImageStorage } from "./core/image-storage";
import { Obstacle } from "./obstacle";
import { randomNumberBetween, shouldWithChance, weightedRandom } from "./core/random-utils";
import { Splash } from "./ui/splash";
import { Score } from "./ui/score";
import { Sprite } from "./core/sprite";
import { RatioedConstants } from "./core/ratioed-consts";
import { isIntersectingOnX } from "./core/intersection-utils";

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
    this.width = GameSettings.c.width;

    this.render(0);
  }

  public generateRandomObstacles(): void {
    const tilesAmount = Math.round(Math.random() * 2);

    for (let i = 0; i < tilesAmount; i++) {
      const obstacleNumber = Math.round(Math.random() * (ImageStorage.obstacles.length - 1));
      const obstacleImage = ImageStorage.obstacles[obstacleNumber];
      const obstacle = new Obstacle({
        x: randomNumberBetween(0, GameSettings.c.offsetWidth - RatioedConstants.obstacle),
        image: obstacleImage,
        row: this,
      });
      this.obstacles.push(obstacle);
    }
  }

  public isIntersectingWithAnyObstacleOnX(x: number): boolean {
    for (const obstacle of this.obstacles) {
      if (isIntersectingOnX(x + RatioedConstants.player, x, obstacle.x + RatioedConstants.obstacle, obstacle.x)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Is intersecting with a human based on provided x
   */
  public isIntersectingWithAHuman(x: number): boolean {
    for (const human of this.humans) {
      const maxPx = x + RatioedConstants.player;
      const maxHx = human.x + RatioedConstants.humanWidth;
      if (isIntersectingOnX(maxPx, x, maxHx, human.x)) {
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
        x: Math.round(randomNumberBetween(-RatioedConstants.humanWidth, GameSettings.c.offsetWidth)),
      }));
    }
  }

  public checkForCrossedRoads(x: number): void {
    let crossedRoadsAmount = 0;
    let basePointsSum = 0;

    console.debug('Check road cross for:', this.humans.length);

    for (const human of this.humans) {
      console.debug('Human x coordinates at the time of crossing:', human.x);

      const dx = x - human.x;
      if (dx * human.direction < 0) {
        console.debug('Not counting this human');
        continue;
      }

      const dxabs = Math.abs(dx);

      // Only award points if within 450px
      if (dxabs <= 450 * GameSettings.ratio) {
        crossedRoadsAmount++;

        const biggestScoreDistance = 100 * GameSettings.ratio;
        const basePoints =
          dxabs <= biggestScoreDistance
            ? 150
            : Math.round(150 * Math.exp(-(dxabs - biggestScoreDistance) / 100));

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

