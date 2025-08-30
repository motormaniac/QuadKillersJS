/**
 * This system is used for handling input from keyboard. To handle mouse input, see pixi Event Handlers
 */

//file global
let Input = {}

Input.CONTEXT_ENUM = {
    UI:"ui",
    GAME:"game",
}

//internal use only
Input.key_map = {}
key_map = {
    "KeyCode":{
        is_down:true/false,

    }
}


Input.InputAction = class {
    hotkeys = [];
    keydown_time = 0;
    keyup_time = 0;
    keydown_events = [];
    keyup_events = [];
    is_down = false;

    constructor(...hotkeys) {
        this.hotkeys = hotkeys;
        for (let hotkey of hotkeys) {
            Input.key_map[hotkey] = this;
        }
    }
    add_keydown_event(event) {
        this.keydown_events.push(event);
    }
    add_keyup_event(event) {
        this.keyup_events.push(event);
    }
    trigger_keydown(millis) {
        if (!this.is_down) {
            this.is_down = true;
            this.keydown_time = millis;
            for (let event of this.keydown_events) {
                event();
            }
        }
    }
    trigger_keyup(millis) {
        if (this.is_down) {
            this.is_down = false;
            this.keyup_time = millis;
            for (let event of this.keyup_events) {
                event();
            }
        }
    }
}


Input.context_map = {}


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
}

window.onkeydown = function(event) {
    Action.queue.input.push(function() {
        Input.key_map[event.code]?.trigger_keydown(Global.millis);
    })
}

window.onkeyup = function(event) {
    Input.key_map[event.code]?.trigger_keyup();
}