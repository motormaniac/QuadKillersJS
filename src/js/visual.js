// All sprites data is held here and referenced by other files

camPos = new Vector2D(200, 200);
camScale = 1;

class TextParticle {
    deleteObject = false;
    startTime = performance.now(); //start time (in ms)
    decay = 500; // time in millis for particle to decay
    text;
    constructor(text, duration, pos, color) {
        this.text = text;
        this.color = color;
        this.pos = pos;
        this.startTime = performance.now(); // Timestamp in ms
        this.duration = duration; // How long before fading starts
        this.textObj = null; //initialized in init
    }

    init() {
        // PIXI.Text setup
        const style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 30,
            fill: this.color,
            align: "center"
        });

        this.textObj = new PIXI.Text(this.text, style);
        this.textObj.anchor.set(0.5);
        this.textObj.position.set(this.pos.x, this.pos.y);

        Global.app.stage.addChild(textObj);
    }

    update() {
        const now = performance.now();

        if (now < this.startTime + this.duration) {
            // Fully visible, fixed position
            this.textObj.alpha = 1.0;
            this.textObj.position.set(this.pos.x, this.pos.y);
        }
        else if (now > this.startTime + this.duration + this.decay) {
            // Lifetime exceeded, mark for deletion
            this.deleteObject = true;
            this.textObj.parent.removeChild(this.textObj);
            this.textObj.destroy();
        }
        else {
            // In decay phase: fade + float upward
            const t = (now - (this.startTime + this.duration)) / this.decay; // 0 → 1
            this.textObj.alpha = 1 - t;
            this.textObj.position.set(this.pos.x, this.pos.y - (t * 50)); // rise up to 50px
        }
    }
}

function drawGrid(spacing) {
    // Draw a grid "tile"
    let gridTile = new PIXI.Graphics();
    gridTile.lineStyle(1, 0x000000, 0.2);

    // x is horizontal, y is vertical lines
    gridTile.moveTo(0, 0);
    gridTile.lineTo(0, spacing);

    gridTile.moveTo(0, 0);
    gridTile.lineTo(spacing, 0);

    // make texture
    let gridtTexture = app.renderer.generateTexture(
        gridTile,
        PIXI.SCALE_MODES.NEAREST,
        1,
        new PIXI.Rectangle(0, 0, spacing, spacing)
    );

    // tile texture
    const gridTileSprite = new PIXI.TilingSprite(
        gridTexture,
        Global.app.renderer.width,
        Global.app.renderer.height
    );

    Global.app.stage.addChild(gridTileSprite);

    return gridTileSprite;
}

// to initialize the grid, grid = drawGrid(50)
// to update the grid, grid.TilePosition.x = -camPos.x (offset it according to camPos)
// to change the scale, grid.scale.set(camScale)