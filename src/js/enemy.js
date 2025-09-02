let Enemy = {}
Enemy.init_enemy = function() {}

Enemy.WalkEnemy = class extends GameObject {
    types = [
        Global.EntityTypes.ENEMY,
        Global.EntityTypes.WALK_ENEMY,
    ];
    max_acceleration = 200;
    max_speed = 100;

    constructor() {
        super();
    }
    
    init() {
        let avoid_enemy_ic = new Enemy.AvoidEnemyIC(this);
        interact_components = {
            "enemy":avoid_enemy_ic,
        }
    }
}

Enemy.AvoidEnemyIC = class extends InteractComponent {
    power; //how much the avoid vector affects acceleration
    ignore_radius; //if the other enemy is further away than this, do nothing
    constructor(parent, power=100, ignore_radius=50) {
        super(parent);
        this.power = power;
    }
    run(other) {
        let delta = this.parent.position.sub(other.position);
        if (delta.magSq() > Math.pow(this.ignore_radius,2)) return;
        let avoidComponent = delta.setMag(this.power);
        this.parent.acceleration += avoidComponent;
    }
}

Enemy.WalkEnemyAttractIC = class extends InteractComponent {
    power = 100;
    constructor(parent, power=100) {
        super(parent);
        this.power = power;
    }
}