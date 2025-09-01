/**
 * This system is used for handling input from keyboard. To handle mouse input, see pixi Event Handlers
 */

//file global
let Input = {}

Input.CONTEXT_ENUM = {
    REBIND:"rebind",
    UI:"ui",
    GAME:"game",
}

Input.current_context = null

Input.context_map = {}

//internal use only
Input.key_map = {}
// key_map = {
//     "keycode":KeyMapInstanceStruct
//     "keycode":KeyMapInstanceStruct
// }

Input.KeyMapInstanceStruct = class {
    is_down = false
    input_action = null
    constructor(input_action) {
        this.input_action = input_action;
    }
}

/**
 * Class representing an action that can be binded to multiple keybinds
 */
Input.InputAction = class {
    hotkeys = [];
    keydown_time = 0;
    keyup_time = 0;
    keydown_events = [];
    keyup_events = [];
    /**
     * If true, keydown event will trigger even if key is already down
     * E.g. if both "KeyW" and "ArrowUp" are hotkeys, pressing W while holding ArrowUp will trigger keydown event again
     */
    allow_overlap = false;

    /**
     * @param  {...string} hotkeys List of keycodes that trigger this action
     * E.g. new InputAction("KeyW", "ArrowUp")
     */
    constructor(...hotkeys) {
        this.hotkeys = hotkeys;
        for (let hotkey of hotkeys) {
            Input.key_map[hotkey] = new Input.KeyMapInstanceStruct(this);
        }
    }
    /**
     * Adds a function to be called when this key is pressed
     * @param {Function} event Function to call when key is pressed
     */
    add_keydown_event(event) {
        this.keydown_events.push(event);
    }
    /**
     * Adds a function to be called when this key is released
     * @param {Function} event Function to call when key is released
     */
    add_keyup_event(event) {
        this.keyup_events.push(event);
    }
    /**
     * @returns {boolean} True if any of the hotkeys are currently pressed
     */
    check_is_down() {
        //or
        let is_down = false;
        for (let hotkey of this.hotkeys) {
            if (Input.key_map[hotkey]?.is_down) {
                is_down = true;
                break;
            }
        }
        return is_down;
    }
    /**
     * Internal function triggered when key is pressed
     * @param {float} seconds The time in seconds this key was pressed
     */
    trigger_keydown(seconds) {
        if (this.allow_overlap || !this.check_is_down()) {
            this.keydown_time = seconds;
            for (let event of this.keydown_events) {
                event();
            }
        }
    }
    /**
     * Internal function triggered when key is released
     * @param {float} seconds The time in seconds this key was released
     */
    trigger_keyup(seconds) {
        if (this.allow_overlap || this.check_is_down()) {
            this.keyup_time = seconds;
            for (let event of this.keyup_events) {
                event();
            }
        }
    }
}


//Initializes variables inside this file
Input.init_input = function() {
    Input.context_map = {
        "game":{
            "up": new Input.InputAction("KeyW", "ArrowUp"),
            "down": new Input.InputAction("KeyS", "ArrowDown"),
            "left": new Input.InputAction("KeyA", "ArrowLeft"),
            "right": new Input.InputAction("KeyD", "ArrowRight"),
            "dash": new Input.InputAction("Space"),
        }
    }
    Input.context_map.game.up.add_keydown_event(function() { console.log("up pressed") });
    Input.context_map.game.up.add_keyup_event(function() { console.log("up released") });
    Input.context_map.game.left.add_keydown_event(function() { console.log("down pressed") });
}

window.onkeydown = function(keyevent) {
    Action.queue.input.push(
        new Action.QueuedActionStruct(
            () => {
                Input.key_map[keyevent.code]?.trigger_keydown(Global.seconds)
                Input.key_map[keyevent.code]?.is_down = true
            }
        )
    )
}

window.onkeyup = function(event) {
    Action.queue.input.push(
        new Action.QueuedActionStruct(
            () => {
                Input.key_map[keyevent.code]?.trigger_keyup(Global.seconds)
                Input.key_map[keyevent.code]?.is_down = false
            }
        )
    )
}