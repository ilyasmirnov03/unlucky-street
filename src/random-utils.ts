export function weightedRandom(weights: Record<number, number>): number {
  let rand = Math.random();
  let sum = 0;

  for (let num in weights) {
    sum += weights[num];
    if (rand <= sum) {
      return parseInt(num);
    }
  }

  return 0;
}

export function shouldWithChance(chance: number): boolean {
  return Math.random() <= chance;
}

export function randomNumberBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
