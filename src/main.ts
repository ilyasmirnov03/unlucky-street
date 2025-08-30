import { GameLoop } from './core/game-loop';
import { GameSettings } from './core/game-settings';
import { GameMap } from './game-map';
import { ImageStorage } from './core/image-storage';
import { Player } from './player';
import './styles.css';
import { DeathScreen } from './ui/death-screen';
import { LivesUi } from './ui/lives';

window.addEventListener('DOMContentLoaded', async () => {
  const gameLoop = new GameLoop();
  DeathScreen.init(gameLoop);
  LivesUi.container = document.getElementById('lives') as HTMLElement;
  await ImageStorage.init();

  const canvas = document.getElementById('game') as HTMLCanvasElement;
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

