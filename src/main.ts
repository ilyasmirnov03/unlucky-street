import { GameLoop } from './core/game-loop';
import { GameSettings } from './core/game-settings';
import { ImageStorage } from './core/image-storage';
import './styles.css';
import { DeathScreen } from './ui/death-screen';
import { LivesUi } from './ui/lives';
import { Score } from './ui/score';
import { getById } from './core/dom-utils';
import { MobileControls } from './core/mobile-controls';
import { RatioedConstants } from './core/ratioed-consts';
import { StartMenu } from './ui/start-menu';

window.addEventListener('DOMContentLoaded', async () => {
  const gameLoop = new GameLoop();
  DeathScreen.init(gameLoop);

  Score.init();
  LivesUi.init();
  MobileControls.init();
  await ImageStorage.init();

  const canvas = getById<HTMLCanvasElement>('game');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;
  context.font = '32px sans-serif';
  GameSettings.canvas = canvas;
  GameSettings.context = context;

  let ratio = 1;
  if (canvas.width < 720) {
    ratio = canvas.width / 720;
  }
  GameSettings.ratio = ratio;
  RatioedConstants.applyRatio(ratio);
  StartMenu.init(gameLoop);
});

