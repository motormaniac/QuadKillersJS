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

    const graphics_context = new PIXI.GraphicsContext()
    graphics_context
        .rect(100, 100, 100, 100)
        .fill("#ff0000")
        .stroke({width:0})
    const graphics = new PIXI.Graphics(graphics_context);
    Global.app.stage.addChild(graphics);

    const graphics2 = new PIXI.Graphics(Player.player_graphics_context)
    // Global.app.stage.addChild(graphics2)

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
    console.log(Global.app.stage.children)
}
start();
