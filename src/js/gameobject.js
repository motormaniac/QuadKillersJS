/**
 * Base class for all game objects. Extend this class to create specific game objects.
 */
class GameObject {
    id = 0; //unique identifier for this object
    types = [Global.EntityTypes.DEFAULT]; //list of entity types this object belongs to
    collider = null;
    position = Vector2D.ZERO;
    posRef = new Vector2DRef(this.position)
    velocity = Vector2D.ZERO;
    velRef = new Vector2DRef(this.velocity)
    acceleration = Vector2D.ZERO;
    accRef = new Vector2DRef(this.acceleration)
    rotation = 0; //radians
    delete = false; //if true, this object will be deleted at the end of the frame

    /**
     * The extended class should call its parents constructor:
     * ```js
     * //child constructor
     * constructor() {
     *      super()
     * }
     * ```
     */
    constructor() {
        this.id = Global.id;
        Global.id ++;
        Action.queue.entity_init.push(
            new Action.QueuedAction(
                ()=> this.init()
            )
        );
    }
    /**
     * Tells the object how to interact with other game objects. The key is an EntityTypes enum, and the value is a function.
     * The idea is that this dynamic component system lets you easily reuse interactions such as an enemy being hit by a weapon.
     * 
     * Some examples:
     * ```javascript
     * {
     *   //using lambda expressions allow you to specifiy specific paramaters for that specific class or object
     *   //IC stands for Interact Component
     *   "player": PlayerIC,
     *   "enemy": EnemyIC,
     * }
     * ```
     */
    interact_components = {}

    /**
     * Override this
     * Note that the constructor is called when the object is created, while init is called at a specific point in the action cycle
     */
    init(){}
    /**
     * Do not override
     * Checks collisions and interactions with other game objects.
     * Does a for loop through all game objects and checks for collisions/interactions.
     * @param {int} index The index of this object in the Global.entities array
     */
    pre_interact() {}
    check_interactions(other) {
        //find the gameobject type in the interact_components dictionary and run the associated function
        for (let type of other.types) {
            let run = this.interact_components[type]
            if (run) {
                run(other)
            }
        }
    }
    post_interact(){}
    /**
     * Called when this object interacts with another object (e.g. collision)
     */
    update(){}
    /**
     * Do not override
     */
    phys_update() {
        this.accRef.v = this.acceleration
        this.velocity = this.velocity.add(this.acceleration.mul(Global.ticker.deltaTime))
        this.velRef.v = this.velocity
        this.position = this.position.add(this.velocity.mul(Global.ticker.deltaTime))
        this.posRef.v = this.position
    }
    draw(){}
    onDelete(){}
}