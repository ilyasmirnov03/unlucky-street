import { GameMap } from './game-map';
import { GameSettings } from './game-settings';
import { ImageStorage } from './image-storage';
import { loadHumanAssets, loadObstacleAssets, loadPlayerAssets } from './load';
import { Player } from './player';
import './styles.css';
import { LivesUi } from './ui/lives';
import { Splash } from './ui/splash';

function render(
  ctx: CanvasRenderingContext2D,
  player: Player,
  gameMap: GameMap,
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#3c2c6b';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  gameMap.update();
  player.update();
  Splash.update();
  requestAnimationFrame(render.bind(this, ctx, player, gameMap));
}

window.addEventListener('DOMContentLoaded', async () => {
  LivesUi.container = document.getElementById('ui') as HTMLElement;

  ImageStorage.obstacles = await loadObstacleAssets();
  ImageStorage.playerImages = await loadPlayerAssets();
  ImageStorage.humanImages = await loadHumanAssets();

  const canvas = document.getElementById('game') as HTMLCanvasElement;
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;
  context.font = '32px sans-serif';
  GameSettings.canvas = canvas;
  GameSettings.context = context;

  const gameMap = new GameMap();
  gameMap.generateNewMap();
  const player = new Player(gameMap);

  render(context, player, gameMap);
});

