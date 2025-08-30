// import * as PIXI from 'pixi.js';

Global = {}
Global.millis = 0

Global.entities = []

async function start() {
    
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

}
start();