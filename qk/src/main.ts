import {Application, GraphicsContext, Graphics} from 'pixi.js';
import { GameManager } from './GameManager';

let graphicsContext : GraphicsContext = new GraphicsContext()
  .rect(0, 0, 100, 100)
  .fill('#ff0000');

(async () => {
  let app = new Application();
  await app.init({ background: '#000000ff', resizeTo: window });
  let canvas = app.canvas;
  canvas.classList.add('game-canvas');
  document.body.appendChild(canvas);
  
  let gameManager = new GameManager(app.stage);
  gameManager.startGame();

  let graphics = new Graphics(graphicsContext);
  app.stage.addChild(graphics);

  app.ticker.add((ticker) => {
    gameManager.update(ticker.deltaTime);
  });
})()