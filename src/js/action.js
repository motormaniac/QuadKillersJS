//This script is used to control the order of events during the game
//Action goes in order of each queue, completing all actions in that queue before moving to the next queue
//E.g. if during input, an action is added to input, it WON'T be processed until next frame
//However, if during input, an action is added to physics, it WILL be processed this frame

let Action = {}

Action.init_file = function() {
}

//This list represents the order of queues
Action.queue = {
    entity_init: [],
    pre_interact:[],
    post_interact:[],
    input: [],
}

// Action.queue = {
//     input: [
//         QueuedAction, QueuedAction, QueuedAction
//     ]
// }

Action.QueuedAction = class {
    frameDelay = 0
    params = {}
    callback = null

    /**
     * 
     * @param {Function} callback Function / lambda
     * @param {int} frameDelay How many frames to delay this action by. 0 framedelay (default) means no delay
     * Action calls this when it reaches it in queue: myCallback(myParams)
     */
    constructor(callback, frameDelay=0) {
        this.callback = callback;
        this.frameDelay = frameDelay;
    }
    /**
     * Runs the action if it is ready
     * @returns {boolean} True if action was run, false if it is still waiting (due to framedelay)
     */
    run() {
        
    }
}

Action.update_queue = function(queue_array) {
    for (let i = queue_array.length - 1; i >= 0; i--) {
        const action = queue_array[i];
        if (action.frameDelay > 0) {
            action.frameDelay -= 1;
        } else {
            action.callback();
            queue_array.splice(i, 1); // remove the item from the queue
        }
    }
}

Action.update = function(ticker) {

    //entity init
    Action.update_queue(Action.queue.entity_init);
    //pre interact
    Action.update_queue(Action.queue.pre_interact)
    for (entity of Global.entities) {
        entity.pre_interact()
    }
    //check interactions
    for (let i=0; i < Global.entities.length; i++) {
        //ensures that you only check each pair of objects once
        for (let j = i+1; j < Global.entities.length; j++) {
            Global.entities[i].check_interactions(Global.entities[j])
            Global.entities[j].check_interactions(Global.entities[i])
        }
    }
    //post interact
    Action.update_queue(Action.queue.post_interact);
    //input
    Action.update_queue(Action.queue.input);
    //update
    for (let entity of Global.entities) {
        entity.update(ticker);
    }
    for (let entity of Global.entities) {
        entity.phys_update()
    }
    for (let entity of Global.entities) {
        entity.draw()
    }
    //delete
    for (let [index, entity] of Global.entities.entries()) {
        if (entity.delete) {
            entity.onDelete();
            Global.entities.splice(index, 1);
        }
    }
}