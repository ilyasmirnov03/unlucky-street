export class Score {

  private static container: HTMLElement;

  private static score = 0;

  public static init(): void {
    this.container = document.getElementById('score') as HTMLElement;
    this.addScore(0);
  }

  public static addScore(score: number, reset = false): void {
    if (reset) {
      this.score = 0;
    } else {
      this.score += score;
    }
    this.container.textContent = this.score.toString();
  }

}

