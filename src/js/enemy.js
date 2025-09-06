let Enemy = {}
Enemy.enemy_graphics_context
Enemy.init_file = function() {
    Enemy.enemy_graphics_context = new PIXI.GraphicsContext()
        .circle(0,0,25)
        .fill("#700000")
}


Enemy.WalkEnemy = class extends GameObject {
    graphics = null
    types = [
        Global.EntityTypes.ENEMY,
        Global.EntityTypes.WALK_ENEMY,
    ];
    frict_factor = 0.3;
    max_move_speed = 3;
    velocity_lerp_factor = 0.2;

    avoid_enemy_ic
    attract_to_player

    accum_move_vec = Vector2D.ZERO


    constructor() {
        super();
    }
    
    init() {
        console.log("enemy init")
        this.avoid_enemy_ic = new Enemy.AvoidEnemyIC(this);
        this.attract_to_player = new Enemy.WalkEnemyAttractToPlayer(this);

        this.interact_components = {
            // [Global.EntityTypes.ENEMY]: this.avoid_enemy_ic.run,
            [Global.EntityTypes.PLAYER]: (other)=>this.attract_to_player.run(other),
        }

        this.graphics = new PIXI.Graphics(Enemy.enemy_graphics_context);
        Global.app.stage.addChild(this.graphics)
    }

    update() {
        if (this.velocity.magSq() <= Math.pow(this.max_move_speed+0.1, 2)) {
            this.velocity = this.velocity.lerp(this.accum_move_vec.setMag(this.max_move_speed), this.velocity_lerp_factor * Global.ticker.deltaTime)
        }
        // this.velocity = this.accum_move_vec.setMag(this.max_move_speed)
        this.accum_move_vec = Vector2D.ZERO

        // this.acceleration = this.acceleration.add(this.velocity.mul(-this.frict_factor))
    }

    draw() {
        this.graphics.position.set(this.position.x, this.position.y)
    }
}

Enemy.AvoidEnemyIC = class {
    parent = null
    power; //how much the avoid vector affects acceleration
    ignore_radius; //if the other enemy is further away than this, do nothing
    constructor(parent, power=100, ignore_radius=50) {
        this.parent = parent;
        this.power = power;
        this.ignore_radius = ignore_radius;
    }
    run(other) {
        let delta = this.parent.position.sub(other.position);
        if (delta.magSq() > Math.pow(this.ignore_radius,2)) return;
        let avoidComponent = delta.setMag(this.power);
        this.parent.acceleration += avoidComponent;
    }
}

/**
 * When an enemy (parent) interacts with a player (other)
 * To avoid enemy clumping, the enemies first move towards a spot that is randomly offseted from the player
 * Random radius is how far away this offset is from the player
 * Once enemies are within the radius, they move directly towards the player (not offset)
 */
Enemy.WalkEnemyAttractToPlayer = class {
    parent = null
    power;
    random_offset;
    random_radius
    visualize = true //debug tool
    visual_graphic = null
    constructor(parent, power=100, random_radius=100) {
        this.parent = parent
        this.power = power
        //generate a normalized random vector with bounds -1 to 1
        this.random_radius = random_radius
        this.random_offset = Vector2D.map(Vector2D.random(), 0,1,-1,1).setMag(random_radius)
        
        if (this.visualize) {
            this.visual_graphic = new PIXI.Graphics()
                .rect(0,0,5)
                .fill("#ff0000")
            Global.app.stage.addChild(this.visual_graphic)
        }
    }
    //Other should be player
    run(other) {
        let delta = other.position.sub(this.parent.position)
        if (delta.magSq() <= Math.pow(this.random_radius,2)) {
            this.parent.accum_move_vec = this.parent.accum_move_vec.add(delta.setMag(this.power))
            console.log(this.parent.accum_move_vec)
        } else {
            let delta = other.position.add(this.random_offset).sub(this.parent.position)
            this.parent.accum_move_vec = this.parent.accum_move_vec.add(delta.setMag(this.power))

            if (this.visualize) {
                this.visual_graphic
                    .clear()
                    .moveTo(this.parent.position.x, this.parent.position.y)
                    .lineTo(other.position.x, other.position.y)
            }
        }

    }
}