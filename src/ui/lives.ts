import { getById } from "../core/dom-utils";
import { ImageStorage } from "../core/image-storage";

export class LivesUi {

  private static c: HTMLElement;

  public static init(): void {
    this.c = getById('lives');
  }

  public static renderLives(lives: number): void {
    console.debug('Player lives:', lives);
    this.c.replaceChildren();
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
      this.c.appendChild(img);
    }
  }
}

