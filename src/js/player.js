// import * as PIXI from "pixi.js"

Player = {}
Player.init_file = function() {
    Player.player_graphics_context = new PIXI.Graphics()
        .fill("#00ffff")
        .rect(-25,-25,50,50)
}

Player.PlayerStates = {
    MOVE:"move",
    DASH:"dash",
}

Player.PlayerClass = class extends GameObject {
    types = [Global.EntityTypes.PLAYER];
    max_velocity = 10
    can_move = true //whether computer inputs can control the player
    graphics = null

    constructor(){
        super()
    }

    init() {
        this.graphics = new PIXI.Graphics(Player.player_graphics_context)
        // Global.app.stage.addChild(graphics)
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
            if (this.can_move && this.velocity.magSq() <= Math.pow(this.max_velocity+0.1,2)) { //little bit of float tolerance
                this.velocity = input_dir.setMag(this.max_velocity)
            }
        }
        console.log(this.position)
    }
}