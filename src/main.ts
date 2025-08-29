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
  ImageStorage.obstacles = await loadObstacleAssets();
  ImageStorage.playerImages = await loadPlayerAssets();

  const uiCanvas = document.getElementById('ui') as HTMLCanvasElement;
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  uiCanvas.width = document.body.offsetWidth;
  uiCanvas.height = document.body.offsetHeight;
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  const uiContext = uiCanvas.getContext('2d') as CanvasRenderingContext2D;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;
  context.font = '32px sans-serif';
  uiContext.imageSmoothingEnabled = false;
  uiContext.font = '32px sans-serif';
  GameSettings.canvas = canvas;
  GameSettings.context = context;
  GameSettings.uiCanvas = uiCanvas;
  GameSettings.uiContext = uiContext;

  const gameMap = new GameMap();
  gameMap.generateNewMap();
  const player = new Player(gameMap);

  render(context, player, gameMap);
});

