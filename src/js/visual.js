// All sprites data is held here and referenced by other files

Visual.init_file = function () {
    grid = drawGrid(50, new PIXI.Graphics()).stroke({ color: 0xffffff, pixelLine: true, width: 1 });
    grid.x=0
    grid.y=0
    //app.stage.addChil(grid)
}

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

function drawGrid(spacing, graphics) {
    //a graphics object is used as an argument because I'm lazy with setup

  let x = -camPos.x % spacing; //set x pos
  while ( x >= 0) { //make sure there is a shape comletely off screen so that it can smoothly pan in
    x-=spacing;
  }
  while (x < app.renderer.width / camScale) {
    graphics.moveTo(x,0).lineTo(x,app.renderer.height/camScale);
    x+=spacing;
  }
  
  let y = -camPos.y % spacing; //set y pos
  while (y >= 0) { //set y pos top edge
      y-=spacing;
    }
  while (y < app.renderer.height / camScale) {
    graphics.moveTo(0,y).lineTo(app.renderer.width/camScale,y);
    y+=spacing;
  }

  return graphics;
}

function updateGrid () {
    grid.x=-camPos.x;
    grid.y=-camPos.y;
    grid.scale=(camScale)
}