Player = {}
Player.init_file = function() {
    Player.player_graphics_context = new PIXI.GraphicsContext()
        .rect(-25,-25,50,50)
        .fill("#00ffff")
}

Player.PlayerStates = {
    MOVE:"move",
    DASH:"dash",
}

Player.PlayerClass = class extends GameObject {
    types = [Global.EntityTypes.PLAYER];
    move_acceleration = 2; //acceleration while using WASD
    max_speed = 5
    frict_factor = 0.38; //friction
    can_move = true //whether computer inputs can control the player
    graphics = null

    constructor(){
        super()
    }

    init() {
        this.graphics = new PIXI.Graphics(Player.player_graphics_context);
        Global.app.stage.addChild(this.graphics);
        // Input.context_map.game.dash.add_keydown_event()
    }

    change_to_state(state) {

    }

    update() {
        let input_dir = Vector2D.zero(); //input direction
        if (Input.current_context === Input.ContextEnum.GAME) {
            let context = Input.context_map.game
            if (context.up.is_pressed()) {
                input_dir = input_dir.add(0,-1)
            }
            if (context.down.is_pressed()) {
                input_dir = input_dir.add(0,1)
            }
            if (context.right.is_pressed()) {
                input_dir = input_dir.add(1,0)
            }
            if (context.left.is_pressed()) {
                input_dir = input_dir.add(-1,0)
            }
            //make sure that movement does not override kb effects
            if (this.can_move && this.velocity.magSq() <= Math.pow(this.max_speed+0.1,2)) { //little bit of float tolerance
                this.acceleration = input_dir.setMag(this.move_acceleration)
            }
            //apply friction proportional to velocity
            this.acceleration = this.acceleration.add(this.velocity.mul(-this.frict_factor))
        }
    }
    draw() {
        console.log(this.velocity.magnitude())
        this.graphics.position.set(this.position.x, this.position.y)
    }
}