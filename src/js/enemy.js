let Enemy = {}
Enemy.enemy_graphics_context
Enemy.init_file = function() {
    Enemy.enemy_graphics_context = new PIXI.GraphicsContext()
        .circle(0,0,25)
        .fill("#ff0000")
}


Enemy.WalkEnemy = class extends GameObject {
    graphics = null
    types = [
        Global.EntityTypes.ENEMY,
        Global.EntityTypes.WALK_ENEMY,
    ];
    frict_factor = 0.2;
    max_move_speed = 3;
    velocity_lerp_factor = 0.2;

    avoid_enemy
    attract_to_player

    accum_avoid = Vector2D.ZERO


    constructor() {
        super();
    }
    
    init() {
        this.avoid_enemy = new Enemy.AvoidEnemyIC(this);
        this.attract_to_player = new Enemy.WalkEnemyAttractToPlayer(this);

        this.interact_components = {
            [Global.EntityTypes.ENEMY]: (other)=>this.avoid_enemy.run(other),
            [Global.EntityTypes.PLAYER]: (other)=>this.attract_to_player.run(other),
        }

        this.graphics = new PIXI.Graphics(Enemy.enemy_graphics_context);
        Global.app.stage.addChild(this.graphics)
    }

    update() {
        if (this.velocity.magSq() <= Math.pow(this.max_move_speed+0.1, 2)) {
            //weight the attract and avoid vectors evenly (otherwise avoid would be much stronger bc of how many enemies there are)
            //the player attract MUST be weighted higher than enemy avoid
            let target_velocity = this.attract_to_player.player_attract_result.setMag(0.7).add(this.accum_avoid.setMag(0.3)).setMag(this.max_move_speed)
            this.acceleration = target_velocity.sub(this.velocity).mul(this.velocity_lerp_factor)
        }
        this.acceleration = this.acceleration.add(this.velocity.mul(-this.frict_factor))
        // this.velocity = target_velocity
        this.accum_avoid = Vector2D.ZERO
    }

    draw() {
        this.graphics.position.set(this.position.x, this.position.y)
    }
}

//Enemies avoid other enemies close to them (avoids grouping)
Enemy.AvoidEnemyIC = class {
    parent = null
    power; //how much the avoid vector affects acceleration
    ignore_radius; //if the other enemy is further away than this, do nothing
    constructor(parent, power=100, ignore_radius=200) {
        this.parent = parent;
        this.power = power;
        this.ignore_radius = ignore_radius;
    }
    run(other) {
        let delta = this.parent.position.sub(other.position);
        if (delta.magSq() > Math.pow(this.ignore_radius,2)) return;
        //Fall off function: that relates distance to other enemy to the strength of avoidance.
        // 0 radius = 1 (maximum strength), ignore radius = 0 (no strength)
        // power * (1 - (distance / ignore_radius)^2)
        let magnitude = this.power * (1 - Math.pow(delta.mag() / this.ignore_radius, 0.5))
        this.parent.accum_avoid = this.parent.accum_avoid.add(delta.setMag(magnitude))
    }
}

/**
 * When an enemy (parent) interacts with a player (other)
 * To avoid enemy clumping, the enemies attraction to the player is randomized.
 * Visual of randomization: https://www.desmos.com/geometry/5p8hze7hfp
 * The random vector is perpendicular to the enemy player displacement.
 * It is multiplied by a random factor between -1 and 1, where -1 is maximum to the left and 1 is maximum to the right.
 * random_offset is the maximum random distance
 * 
 * To smooth transition between approaching the offseted position vs the player's actual position, the strength of the random vector decreases as the enemy approaches the player.
 * if enemy is beyond outer_random_radius, it uses full strength random
 * If enemy is within inner_random_radius, it goes directly to the player
 * Anything between outer_random_radius and inner_random_radius is lerped
 */
Enemy.WalkEnemyAttractToPlayer = class {
    parent = null
    power;
    random_offset;
    outer_random_radius
    visualize = true //debug tool
    visual_graphic = null

    //parent enemy accesses this value to calculate its movement
    player_attract_result = Vector2D.ZERO

    constructor(parent, power=100, outer_random_radius=200, inner_random_radius = 100, random_offset = 200) {
        this.parent = parent
        this.power = power
        this.outer_random_radius = outer_random_radius
        this.inner_random_radius = inner_random_radius
        this.random_offset = random_offset
        //generate a normalized random vector with bounds -1 to 1
        this.random_factor = Util.map(Math.random(), 0,1,-1,1)
    }
    //Other should be player
    run(other) {
        let enemy_player_delta = other.position.sub(this.parent.position) //delta vector between enemy and player position
        let perpendicular = enemy_player_delta.perpendicular().normalize()
        //blending between outer and inner radius. 1 means complete random (outer radius); 0 means inner radius (no random)
        let blend_factor = Util.clamp(Util.map(enemy_player_delta.mag(), this.inner_random_radius, this.outer_random_radius, 0, 1), 0,1)
        let perp_mag = this.random_factor * this.random_offset * blend_factor
        let attract_vector = other.position.add(perpendicular.setMag(perp_mag)).sub(this.parent.position)
        this.player_attract_result = this.parent.accum_avoid.add(attract_vector.setMag(this.power))
    }
}