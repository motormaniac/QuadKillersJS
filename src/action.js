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
//         {
//             frameDelay:0,
//             params:{a:1, b:2},
//             callback: somefunc},
//         {...},
//         {...}
//     ]
//     params is passed into callback e.g. -> somefunc({a:1, b:2})
// }

Action.process_queue = function(queue) {
    //for each loop iterates over a copy of the array, so we can modify the original array during iteration
    for (let action of queue) {
        if (action.frameDelay > 0) {
            action.frameDelay -= 1;
        } else {
            action.callback(action.params);
        }
    }
}

Action.update = function() {
    Action.process_queue(Action.queue.input);
}