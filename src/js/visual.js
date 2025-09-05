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

//I think it would be more efficient to just tile the grid so I'm gonna look into that
function drawGrid(spacing) {
    // Make or reuse a PIXI.Graphics object
    if (!drawGrid.gfx) {
        drawGrid.gfx = new PIXI.Graphics();
        Global.app.stage.addChild(drawGrid.gfx);
    }

    const grid = drawGrid.gfx;
    grid.clear();

    grid.lineStyle(1, 0x000000, 0.2);

    grid.setTransform(0, 0, camScale, camScale); // scale only

    // Grid offset calculation (so it scrolls with camera)
    let x = -camPos.x % spacing;
    while (x >= 0) {
        x -= spacing;
    }
    while (x < app.renderer.width / camScale) {
        grid.moveTo(x, 0);
        grid.lineTo(x, app.renderer.height / camScale);
        x += spacing;
    }

    let y = -camPos.y % spacing;
    while (y >= 0) {
        y -= spacing;
    }
    while (y < app.renderer.height / camScale) {
        grid.moveTo(0, y);
        grid.lineTo(app.renderer.width / camScale, y);
        y += spacing;
    }
}
