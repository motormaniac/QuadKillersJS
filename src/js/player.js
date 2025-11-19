Player = {}
Player.init_file = function() {
    Player.player_normalGraphics_context = new PIXI.GraphicsContext()
        .rect(-25,-25,50,50)
        .fill("#00ffff")
    Player.player_dashGraphics_context = new PIXI.GraphicsContext()
        .rect(-25,-25,50,50)
        .fill("#ffffff")
}

Player.PlayerClass = class extends GameObject {
    PlayerStates = {
        MOVE:"move",
        DASH:"dash",
        STUN:"stun",
    }
    
    types = [Global.EntityTypes.PLAYER];
    current_state = this.PlayerStates.MOVE
    move_acceleration = 2; //acceleration while using WASD
    max_move_speed = 5
    frict_factor = 0.3; //friction
    can_move = true //whether computer inputs can control the player
    graphics = null

    dash_cooldown = 1000; //ms
    dash_start_time = -this.dash_cooldown; //mathematically allows player to dash instantly
    dash_dir = Vector2D.ZERO
    dash_distance = 1500; //How far the dash travels
    non_zero_input_dir;
    dash_duration = 100; //ms How long the dash lasts

    constructor(){
        super()
    }

    init() {
        //initialize both dash and nondash states
        this.normalGraphics = new PIXI.Graphics(Player.player_normalGraphics_context);
        this.dashGraphics = new PIXI.Graphics(Player.player_dashGraphics_context);

        //add both states to the canvas
        Global.app.stage.addChild(this.normalGraphics);
        Global.app.stage.addChild(this.dashGraphics);

        //disable dash state visibility, no calculations are done for dash state until it's toggled again
        this.dashGraphics.visible = false;
        // Input.context_map.game.dash.add_keydown_event()
    }

    update() {
        if (Input.current_context === Input.ContextEnum.GAME) {
            let input_dir = Vector2D.ZERO; //input direction
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
            if (input_dir.magSq() > 0) {
                this.non_zero_input_dir = input_dir
            }

            if (Global.millis >= this.dash_start_time + this.dash_duration + this.dash_cooldown
                &&context.dash.is_pressed()) {
                //start dash
                this.current_state = this.PlayerStates.DASH;
                this.normalGraphics.visible = false;
                this.dashGraphics.visible = true;
                this.dash_start_time = Global.millis;
                //ensure input_dir is not (0,0)
                this.dash_dir = this.non_zero_input_dir.normalize();
            }

            if (this.current_state === this.PlayerStates.MOVE) {
                //make sure that movement does not override kb effects
                if (this.velocity.magSq() <= Math.pow(this.max_move_speed+0.1,2)) { //little bit of float tolerance
                    this.acceleration = input_dir.setMag(this.move_acceleration);
                }
                //apply friction proportional to velocity
                this.acceleration = this.acceleration.add(this.velocity.mul(-this.frict_factor));

            } else if (this.current_state === this.PlayerStates.DASH) {
                if (Global.millis >= this.dash_start_time + this.dash_duration) {
                    //stop dash
                    this.current_state = this.PlayerStates.MOVE
                    this.dashGraphics.visible = false
                    this.normalGraphics.visible = true
                } else {
                    
                    this.velocity = this.dash_dir.setMag(this.dash_distance / this.dash_duration)
                    this.acceleration = Vector2D.ZERO
                }
            }
        }
    }

    post_interact() {

    }

    draw() {
        this.normalGraphics.position.set(this.position.x, this.position.y)
        this.dashGraphics.position.set(this.position.x, this.position.y) //only pushed to gpu when visible, otherwise no resources used
    }
}