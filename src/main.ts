import { GameMap } from './game-map';
import { GameSettings } from './game-settings';
import { ImageStorage } from './image-storage';
import { loadObstacleAssets, loadPlayerAssets } from './load';
import { Player } from './player';
import './styles.css';
import { Splash } from './ui/splash';

function render(
  ctx: CanvasRenderingContext2D,
  player: Player,
  gameMap: GameMap,
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  gameMap.update();
  player.update();
  Splash.update();
  requestAnimationFrame(render.bind(this, ctx, player, gameMap));
}

window.addEventListener('DOMContentLoaded', async () => {
  const images = await loadObstacleAssets();
  const playerAssets = await loadPlayerAssets();
  ImageStorage.obstacles = images;
  ImageStorage.playerImages = playerAssets;

  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
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

