import { GameMap } from './game-map';
import { Player } from './player';
import './styles.css';

function render(): void {
  requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  const gameMap = new GameMap(context);
  gameMap.generateNewMap();
  new Player(context, gameMap);

  render();
});

