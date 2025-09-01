/**
 * Base class for all game objects. Extend this class to create specific game objects.
 */
class GameObject {
    id = 0; //unique identifier for this object
    types = [Global.EntityTypes.DEFAULT]; //list of entity types this object belongs to
    position = Vector2D.zero();
    velocity = Vector2D.zero();
    collider = null;
    acceleration = Vector2D.zero();
    rotation = 0; //radians
    scale = Vector2D.one();
    delete = false; //if true, this object will be deleted at the end of the frame

    constructor() {
        this.id = Global.id;
        id ++;
        Action.queue.entity_init.push(
            new Action.QueuedActionStruct(
                //not really sure what bind does tbh
                this.init.bind(this)
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
     * Note that the constructor is called when the object is created, while init is called at a specific point in the action cycle
     */
    init(){}
    /**
     * Checks collisions and interactions with other game objects.
     * Does a for loop through all game objects and checks for collisions/interactions.
     * @param {int} index The index of this object in the Global.entities array
     */
    check_interactions(index) {
        //ensures that you only check each pair of objects once
        for (let i = index+1; i < Global.entities.length; i++) {
            let gameobject = Global.entities[i];
            //find the gameobject type in the interact_components dictionary and run the associated function
            for (let type of gameobject.types) {
                this.interact_components[type]?.run(gameobject)
            }
        }
    }
    /**
     * Called when this object interacts with another object (e.g. collision)
     */
    update(){}
    draw(graphics){}
    onDelete(){}
}

class InteractComponent {
    parent = null; //the gameobject this component is attached to
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Override this method
     * @param {GameObject} other The other gameobject this component is interacting with
     */
    run(other){}
}