/**
 * This system is used for handling input from keyboard. To handle mouse input, see pixi Event Handlers
 */

//file global
let Input = {}

Input.ContextEnum = {
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

Input.KeyMapInstance = class {
    is_pressed = false
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
            Input.key_map[hotkey] = new Input.KeyMapInstance(this);
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
    is_pressed() {
        //or operation of all the hotkeys
        let is_pressed = false;
        for (let hotkey of this.hotkeys) {
            if (Input.key_map[hotkey]?.is_pressed) {
                is_pressed = true;
                break;
            }
        }
        return is_pressed;
    }
    /**
     * Internal function triggered when key is pressed
     * @param {float} seconds The time in seconds this key was pressed
     */
    trigger_keydown(seconds) {
        if (this.allow_overlap || !this.is_pressed()) {
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
        //ERRORR
        if (this.allow_overlap || !this.is_pressed()) { //this line is bugged because the keymap is switched to true before this happens
            this.keyup_time = seconds;
            for (let event of this.keyup_events) {
                event();
            }
        }
    }
}

//Initializes variables inside this file
Input.init_file = function() {
    this.current_context = Input.ContextEnum.GAME
    Input.context_map = {
        game:{
            up: new Input.InputAction("KeyW", "ArrowUp"),
            down: new Input.InputAction("KeyS", "ArrowDown"),
            left: new Input.InputAction("KeyA", "ArrowLeft"),
            right: new Input.InputAction("KeyD", "ArrowRight"),
            dash: new Input.InputAction("Space"),
        }
    }
    // Input.context_map.game.up.add_keydown_event(function() { console.log("up pressed") });
    // Input.context_map.game.up.add_keyup_event(function() { console.log("up released") });
}

window.onkeydown = function(keyevent) {
    let key_map_instance = Input.key_map[keyevent.code]
    if (key_map_instance) {
        Action.queue.input.push(
            new Action.QueuedAction(
                () => {
                    if (key_map_instance.is_pressed === false) {
                        //the order of these two lines is important
                        key_map_instance.input_action.trigger_keydown(Global.seconds);
                        key_map_instance.is_pressed = true
                    }
                }
            )
        )
    }
}

window.onkeyup = function(keyevent) {
    let key_map_instance = Input.key_map[keyevent.code]
    if (key_map_instance) {
        Action.queue.input.push(
            new Action.QueuedAction(
                () => {
                    if (key_map_instance.is_pressed === true) {
                        //order of these two lines is important
                        key_map_instance.is_pressed = false
                        key_map_instance.input_action.trigger_keyup(Global.seconds);
                    }
                }
            )
        )
    }
}