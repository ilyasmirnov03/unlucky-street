import { GameLoop } from './core/game-loop';
import { GameSettings } from './core/game-settings';
import { GameMap } from './game-map';
import { ImageStorage } from './core/image-storage';
import { Player } from './player';
import './styles.css';
import { DeathScreen } from './ui/death-screen';
import { LivesUi } from './ui/lives';
import { Score } from './ui/score';
import { getById } from './core/dom-utils';

window.addEventListener('DOMContentLoaded', async () => {
  const gameLoop = new GameLoop();
  DeathScreen.init(gameLoop);
  Score.init();
  LivesUi.init();
  await ImageStorage.init();

  const canvas = getById<HTMLCanvasElement>('game');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;
  context.font = '32px sans-serif';
  GameSettings.canvas = canvas;
  GameSettings.context = context;

  const gameMap = new GameMap();
  const player = new Player(gameMap, gameLoop);

  gameLoop.start(context, player, gameMap);
});

