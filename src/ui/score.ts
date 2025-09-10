export class Score {

  private static c: HTMLElement;

  private static score = 0;

  public static init(): void {
    this.c = document.getElementById('score') as HTMLElement;
    this.addScore(0);
  }

  public static addScore(score: number, reset = false): void {
    if (reset) {
      this.score = 0;
    } else {
      this.score += score;
    }
    this.c.textContent = this.score.toString();
  }

  public static getScore(): number {
    return this.score;
  }

}

