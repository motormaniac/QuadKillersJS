import { Application } from 'pixi.js';
import { gameManager, initGameManager } from './GameManager';
import { createEventManager } from './EventManager';
import { initInputManager } from './InputManager';

(async () => {
  let app = new Application();
  await app.init({ background: '#000000ff', resizeTo: window });
  let canvas = app.canvas;
  canvas.classList.add('game-canvas');
  document.body.appendChild(canvas);
  
  initInputManager();
  initGameManager(app.stage);
  createEventManager();
  gameManager.startGame();

  app.ticker.add((ticker) => {
    gameManager.update(ticker);
  });
})()