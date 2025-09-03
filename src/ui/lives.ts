import { ImageStorage } from "../core/image-storage";

export class LivesUi {

  public static container: HTMLElement;

  public static init(): void {
    this.container = document.getElementById('lives') as HTMLElement;
  }

  public static renderLives(lives: number): void {
    console.debug('Player lives:', lives);
    this.container.replaceChildren();
    let image = 'happy';

    if (lives <= 3) {
      image = 'angry';
    } else if (lives <= 6) {
      image = 'pockerface';
    }

    for (let i = 0; i < 9; i++) {
      if (i + 1 > lives) {
        image = 'empty';
      }
      const img = ImageStorage.icons.get(image)?.cloneNode() as HTMLImageElement;
      img.classList.add('life');
      this.container.appendChild(img);
    }
  }
}

