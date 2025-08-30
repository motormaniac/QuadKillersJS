//This script is used to control the order of events during the game
//Action goes in order of each queue, completing all actions in that queue before moving to the next queue
//E.g. if during input, an action is added to input, it WON'T be processed until next frame
//However, if during input, an action is added to physics, it WILL be processed this frame

let Action = {}

//This list represents the order of queues
Action.queue = {
    input: [],
    collisions: [],
    physics: [],
    render: [],
}

// Action.queue = {
//     input: [
//         {params:{a:1, b:2}, callback: somefunc},
//         {...},
//         {...}
//     ]
//     params is passed into callback e.g. -> somefunc({a:1, b:2})
// }

Action.update = function() {
    //Note each loop DOES NOT look at new actions added to the queue during processing

    for (let action of Action.queue.input) {
        action.callback(action.params);
    }
}