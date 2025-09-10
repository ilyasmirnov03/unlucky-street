import { getById } from "../core/dom-utils";
import { GameLoop } from "../core/game-loop";
import { GameMap } from "../game-map";
import { Player } from "../player";

interface TutorialStart {
  start(): void;
}

interface TutorialPart {
  text: string;
  left: string;
  top: string;
  center?: boolean;
}

export class Tutorial {

  private container: HTMLElement;

  private tutorialWindow: HTMLElement;

  private tutorialText: HTMLElement;

  private tutorialParts: TutorialPart[] = [
    {
      text: 'You play as a black cat crossing the street.',
      left: '50%',
      top: '50%',
      center: true,
    },
    {
      text: 'Move with WASD/Arrows, or by clicking screen edges. (Note: Movement is disabled in tutorial mode)',
      left: '50%',
      top: '50%',
      center: true,
    },
    {
      text: 'Earn points for every human\'s road you cross.',
      left: '10px',
      top: '20%',
    },
    {
      text: 'Obstacles block your path, you must find another way around.',
      left: '10px',
      top: '30%',
    },
    {
      text: 'You start with 9 happiness. Each bump with a human costs 1. At 0, your cat gets annoyed and quits.',
      left: '10px',
      top: '10%',
    },
    {
      text: 'After a bump, you’re briefly invincible - use it to your advantage!',
      left: '10px',
      top: '10%',
    },
    {
      text: 'That’s it. Good luck!',
      left: '50%',
      top: '40%',
      center: true,
    }
  ];

  private currentPositionIndex = 0;

  public init(gameMap: GameMap, player: Player, gameLoop: GameLoop): TutorialStart {
    this.container = getById('t');
    this.tutorialWindow = getById('t-window');
    this.tutorialText = getById('t-text');

    this.tutorialWindow.querySelector('button')?.addEventListener('click', () => {
      this.currentPositionIndex++;
      if (this.currentPositionIndex === this.tutorialParts.length) {
        this.container.style.display = '';
        this.currentPositionIndex = 0;
        return;
      }
      this._setWindowState(this.currentPositionIndex);
    });

    return {
      start: (): void => {
        this.container.style.display = 'block';
        gameLoop.start(player, gameMap);
        this._setWindowState(this.currentPositionIndex);
      }
    }
  }

  private _setWindowState(index: number): void {
    const part = this.tutorialParts[index];
    this.tutorialWindow.style.left = part.left;
    this.tutorialWindow.style.top = part.top;
    this.tutorialText.textContent = part.text;
    if (part.center) {
      this.tutorialWindow.style.transform = 'translateX(-50%)';
    } else {
      this.tutorialWindow.style.transform = '';
    }
  }
}

