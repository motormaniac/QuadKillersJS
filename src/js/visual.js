// All sprites data is held here and referenced by other files

class TextParticle {
    deleteObject = false;
    startTime = performance.now(); //start time (in ms)
    decay = 500; // time in millis for particle to decay
    text;
  constructor(text, duration, pos, color) {
    this.text = text;
    this.color = color; // Hex string or number (e.g. "#ff0000" or 0xff0000)
    this.pos = pos;
    this.startTime = performance.now(); // Timestamp in ms
    this.duration = duration; // How long before fading starts

  }

  init() {
    // PIXI.Text setup
    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 30,
      fill: this.color,
      align: "center"
    });

    textObj = new PIXI.Text(this.text, style);
    textObj.anchor.set(0.5);
    textObj.position.set(this.pos.x, this.pos.y);

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
