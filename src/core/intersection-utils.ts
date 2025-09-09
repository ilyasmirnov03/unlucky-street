export function isIntersectingOnX(maxAx: number, minAx: number, maxBx: number, minBx: number): boolean {
  return !(maxAx < minBx || minAx > maxBx)
}
