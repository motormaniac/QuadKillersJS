// import * as PIXI from 'pixi.js';

let Global = {}
Global.seconds = 0
Global.dt = 1
Global.id = 0; //starts at 0 and increments for each new game object
Global.entities = [] //list of gameobjects

Global.EntityTypes = {
    DEFAULT: 'default',
    PLAYER: 'player',
    ENEMY: 'enemy',
    WALK_ENEMY: 'walk_enemy',
}

let Main = {}

Main.init_main = async function() {
    const app = new PIXI.Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    app.canvas.setAttribute('game-canvas', 'true');
    document.body.appendChild(app.canvas);

    const graphics = new PIXI.Graphics();
    graphics
        .rect(50, 50, 100, 100)
        .fill(0xff0000)
        .stroke({width:0})
    app.stage.addChild(graphics);

    app.ticker.add((ticker) => {
        Global.seconds = ticker.elapsedMS
        Action.update();
    });
}


async function start() {
    Enemy.init_enemy();
    Player.init_player();
    Action.init_action();
    Input.init_input();
    await Main.init_main();
}
start();