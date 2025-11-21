// All sprites data is held here and referenced by other files
Visual = {}
Visual.init_file = function () {
    camPos = new Vector2D(200, 200);
    camScale = 1;
    
   Visual.Visual_gridGraphics_Context = drawGrid(50)
    .stroke({ color: 0x808080, pixelLine: true, width: 1 });
}

Visual.BackgroundClass = class extends GameObject {
    graphics = null
    types = [Global.EntityTypes.DEFAULT];

    constructor () {
        super();
    }

    init() {
        //this grid graphic is the ductape n glue method, I wanna turn it into a tiling sprite if I can using the bgGrid png (or draw a grid and turn it into a texture for tiling)
        this.gridGraphics = new PIXI.Graphics(Visual.Visual_gridGraphics_Context);
        Global.app.stage.addChild(this.gridGraphics);

        //example usage of particle (I could turn this into a particle container but for the time being I won't since I don't know the limitations of that yet)
        //this.shape = new Particle("ELLIPSE", 200,200,400,400,new Vector2D(200,200),200,200, 0x808080)
        //this.shape.drawShape();
        
        //example usage of text
        //this.textTest = new TextParticle("test", 2000, new Vector2D(300,300), 0xffffff);
        //this.textTest.init();
    }

    update() {
        //this.textTest.update();
        //this.shape.update();
    }

    draw() {

    }
}

class Particle {
    constructor(type, p1, p2, p3, p4, pos, duration, decay, decayColor, p5 = 0, p6 = 0) {
        this.type = type;
        this.pos = pos;

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.p5 = p5;
        this.p6 = p6;

        this.decayColor = decayColor;

        this.startTime = performance.now();
        this.duration = duration;
        this.decay = decay;

        this.deleteObject = false;

        this.graphicsParticle = new PIXI.Graphics();
        this.graphicsParticle.position.set(pos.x, pos.y);

        Global.app.stage.addChild(this.graphicsParticle);
    }

    drawShape(alpha = 1.0) {
        const g = this.graphicsParticle;
        g.clear();

        // set fill color & alpha
        const color = (this.decayColor >>> 8); // Pixi ignores alpha channel in color
        g.fill({color, alpha});

        switch (this.type) {
            case "RECT":
                g.drawRect(this.p1, this.p2, this.p3, this.p4);
                break;

            case "ELLIPSE":
                g.ellipse(this.p1, this.p2, this.p3, this.p4);
                break;

            case "TRIANGLE":
                g.drawPolygon([
                    this.p1, this.p2,
                    this.p3, this.p4,
                    this.p5, this.p6
                ]);
                break;
        }

        g.fill();
    }

    update() {
        const now = performance.now();

        if (now < this.startTime + this.duration) {
            this.drawShape(1.0);
        } else if (now < this.startTime + this.duration + this.decay) {
            const t = (now - (this.startTime + this.duration)) / this.decay;
            const alpha = Math.max(0, 1 - t);
            this.drawShape(alpha);
        } else {
            this.deleteObject = true;

            if (this.graphicsParticle.parent)
                this.graphicsParticle.parent.removeChild(this.graphicsParticle);

            this.graphicsParticle.destroy();
        }
    }
}

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

        Global.app.stage.addChild(this.textObj);
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
    ctx = new PIXI.GraphicsContext();

    for (let i = 0; i < window.innerWidth/spacing; i++) {
        ctx.moveTo(i * spacing, 0).lineTo(i * spacing, window.innerHeight);
    }

    for (let i = 0; i < innerHeight/spacing; i++) {
        ctx.moveTo(0, i * spacing).lineTo(window.innerWidth, i * spacing);
    }

    return ctx;
}

function updateGrid () {
    grid.x=-camPos.x;
    grid.y=-camPos.y;
    grid.scale=(camScale)
}