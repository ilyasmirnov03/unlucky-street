import { GameMap } from './game-map';
import { Player } from './player';
import './styles.css';

function render(
  ctx: CanvasRenderingContext2D,
  player: Player,
  gameMap: GameMap,
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  gameMap.update();
  player.update();
  requestAnimationFrame(render.bind(this, ctx, player, gameMap));
}

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  const gameMap = new GameMap(context);
  gameMap.generateNewMap();
  const player = new Player(context, gameMap);

  render(context, player, gameMap);
});

