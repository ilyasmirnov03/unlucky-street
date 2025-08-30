export class LivesUi {

  public static container: HTMLElement;

  public static renderLives(lives: number): void {
    console.debug('Player lives:', lives);
    this.container.replaceChildren();
    for (let i = 0; i < 9; i++) {
      const el = document.createElement('div');
      el.classList.add('life');
      if (i + 1 > lives) {
        el.classList.add('empty');
      }
      this.container.appendChild(el);
    }
  }
}

