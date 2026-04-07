import {Application, GraphicsContext, Graphics} from 'pixi.js';

// let Global = {}
// Global.id = 0; //starts at 0 and increments for each new game object
// Global.entities = [] //list of gameobjects
// Global.app = null;
// Global.ticker = null;
// Global.millis = 0; //how many milliseconds have passed since the ticker started

// Global.EntityTypes = {
//     DEFAULT: 'default',
//     PLAYER: 'player',
//     ENEMY: 'enemy',
//     WALK_ENEMY: 'walk_enemy',
// }

// function start_game() {
//     let player = new Player.PlayerClass()
//     player.position = new Vector2D(200, 200)
//     Global.entities.push(player)

//     for (i = 0; i < 5; i++) {
//         let enemy = new Enemy.WalkEnemy()
//         enemy.position = Vector2D.random().mul(300)
//         Global.entities.push(enemy)
//     }
    
//     let bg = new Visual.BackgroundClass()
//     Global.entities.push(bg)
// }

// async function start() {
    
//     Enemy.init_file();
//     Player.init_file();
//     Visual.init_file();
//     Action.init_file();
//     Input.init_file();
//     await Main.init_file();

//     start_game();
// }
// start();

let graphicsContext : GraphicsContext = new GraphicsContext()
  .rect(0, 0, 100, 100)
  .fill('#ff0000');

(async () => {
  let app = new Application();
  await app.init({ background: '#000000ff', resizeTo: window });
  let canvas = app.canvas;
  canvas.classList.add('game-canvas');
  document.body.appendChild(canvas);

  let graphics = new Graphics(graphicsContext);
  app.stage.addChild(graphics);

  // app.ticker.add((ticker) => {
  //     Global.ticker = ticker;
  //     Global.millis += ticker.elapsedMS;
  //     Action.update();
  // });
})()