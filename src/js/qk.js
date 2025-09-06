let Global = {}
Global.id = 0; //starts at 0 and increments for each new game object
Global.entities = [] //list of gameobjects
Global.app = null;
Global.ticker = null;
Global.millis = 0; //how many milliseconds have passed since the ticker started

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

    app.ticker.add((ticker) => {
        Global.ticker = ticker;
        Global.millis += ticker.elapsedMS;
        Action.update();
    });
}

function start_game() {
    let player = new Player.PlayerClass()
    player.position = new Vector2D(200,200)
    Global.entities.push(player)

    let enemy = new Enemy.WalkEnemy()
    enemy.position = new Vector2D(100,100)
    Global.entities.push(enemy)
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