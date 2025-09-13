import { getById } from "../core/dom-utils";
import { GameLoop } from "../core/game-loop";
import { GameMap } from "../game-map";
import { Player } from "../player";

interface TutorialStart {
  start(): void;
}

interface TutorialPart {
  t: string;
  l: string;
  top: string;
  c?: boolean;
}

export class Tutorial {

  private c: HTMLElement;

  private tutorialWindow: HTMLElement;

  private tutorialText: HTMLElement;

  private tutorialParts: TutorialPart[] = [
    {
      t: 'You play as a black cat crossing a Halloween street.',
      l: '50%',
      top: '50%',
      c: true,
    },
    {
      t: 'Move with WASD/Arrows (PC). On mobile, tap left/right or any place on the screen to go up. (Disabled in tutorial)',
      l: '50%',
      top: '50%',
      c: true,
    },
    {
      t: 'Your goal is to earn points by crossing peoples\' roads. The closer you are while crossing, the more points!',
      l: '10px',
      top: '20%',
    },
    {
      t: 'Cross close to humans to have a chance of them dropping fish crackers. +1 happiness each!',
      l: '10px',
      top: '30%',
    },
    {
      t: 'Obstacles block path — find another way.',
      l: '10px',
      top: '40%',
    },
    {
      t: 'Your cat starts with 9 happiness. Each time it bumps into a human, it loses 1. At 0, your cat gets annoyed and quits.',
      l: '10px',
      top: '10%',
    },
    {
      t: 'After a bump, you’re briefly invincible — use it!',
      l: '10px',
      top: '10%',
    },
    {
      t: 'That’s it. Good luck! ;)',
      l: '50%',
      top: '40%',
      c: true,
    },
  ];

  private currentPositionIndex = 0;

  public init(gameMap: GameMap, player: Player, gameLoop: GameLoop): TutorialStart {
    this.c = getById('t');
    this.tutorialWindow = getById('t-window');
    this.tutorialText = getById('t-text');

    this.tutorialWindow.querySelector('button')?.addEventListener('click', () => {
      this.currentPositionIndex++;
      if (this.currentPositionIndex === this.tutorialParts.length) {
        this.c.style.display = '';
        this.currentPositionIndex = 0;
        return;
      }
      this._setWindowState(this.currentPositionIndex);
    });

    return {
      start: (): void => {
        this.c.style.display = 'block';
        gameLoop.start(player, gameMap);
        this._setWindowState(this.currentPositionIndex);
      }
    }
  }

  private _setWindowState(index: number): void {
    const part = this.tutorialParts[index];
    this.tutorialWindow.style.left = part.l;
    this.tutorialWindow.style.top = part.top;
    this.tutorialText.textContent = part.t;
    if (part.c) {
      this.tutorialWindow.style.transform = 'translateX(-50%)';
    } else {
      this.tutorialWindow.style.transform = '';
    }
  }
}

