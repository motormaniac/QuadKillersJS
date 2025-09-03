// import * as PIXI from 'pixi.js';

let Global = {}
Global.seconds = 0
Global.dt
Global.id = 0; //starts at 0 and increments for each new game object
Global.entities = [] //list of gameobjects
Global.app = null

Global.EntityTypes = {
    DEFAULT: 'default',
    PLAYER: 'player',
    ENEMY: 'enemy',
    WALK_ENEMY: 'walk_enemy',
}

let Main = {}

Main.init_file = async function() {
    let app = new PIXI.Application();
    Global.app = app;
    await app.init({ background: '#555555ff', resizeTo: window });
    app.canvas.setAttribute('game-canvas', 'true');
    document.body.appendChild(app.canvas);

    const graphics = new PIXI.Graphics();
    graphics
        .rect(50, 50, 100, 100)
        .fill(0xff0000)
        .stroke({width:0})
    app.stage.addChild(graphics);

    app.ticker.add((ticker) => {
        Global.dt = ticker.deltaTime
        Global.seconds = ticker.elapsedMS
        Action.update();
    });
}

function start_game() {
    let player = new Player.PlayerClass()
    Global.entities.push(player)
}

async function start() {
    Enemy.init_file();
    Player.init_file();
    Action.init_file();
    Input.init_file();
    await Main.init_file();

    start_game();
}
start();