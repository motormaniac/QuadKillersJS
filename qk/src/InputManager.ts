import { logError } from "./Error";
import { gameManager } from "./GameManager";

/**
 * This system is used for handling input from keyboard. To handle mouse input, see pixi Event Handlers
 */

/** What "mode" the inputs are in. Different input actions will only be enabled when the context is set to that mode */
export const ContextEnum = {
  GAME: "game",
  REBIND: "rebind",
  UI:"ui",
};
type ContextEnumType = typeof ContextEnum[keyof typeof ContextEnum];

/**
 * Class representing an action that can be binded to multiple keybinds
 * Ex: "right" is the action, and the keys would be "KeyD" and "ArrowRight"
 */
export class InputAction {
  #isPressed:boolean = false;
  #keydownTime:number = 0; // last time this key was pressed
  #keyupTime:number = 0; // last time this key was released
  #keydownEvents: (() => void)[] = [];
  #keyupEvents: (() => void)[] = [];

  /**
   * If true, keydown/keyup events will trigger even if key is already down.
   * E.g. if both "KeyW" and "ArrowUp" are hotkeys, pressing W while holding ArrowUp will trigger keydown event again
   */
  #allowOverlap = false;

  /**
   * @param keys keycode strings that will trigger this action
   * @param allowOverlap (default false) If true, keydown/keyup events will trigger even if the key is already down.
   */
  constructor(keys:string[], allowOverlap:boolean = false) {
    this.#allowOverlap = allowOverlap;
    keys.forEach(key => {
      if (!inputManager.keyMap[key]) {
        inputManager.keyMap[key] = [];
      }
      inputManager.keyMap[key].push(this);
    });
  }
  /**
   * Adds a function to be called when this key is pressed
   * @param {() => void} event Function to call when key is pressed
   */
  onKeydown(event:() => void) {
    this.#keydownEvents.push(event);
  }
  /**
   * Adds a function to be called when this key is released
   * @param {() => void} event Function to call when key is released
   */
  onKeyup(event:() => void) {
    this.#keyupEvents.push(event);
  }
  /**
   * Internal function triggered when key is pressed
   * @param {float} millis The time in millis this key was pressed
   */
  triggerKeydown(millis:number) {
    if (this.#allowOverlap || !this.#isPressed) {
      this.#isPressed = true;
      this.#keydownTime = millis;
      this.#keydownEvents.forEach(event => event());
    }
  }
  /**
   * Internal function triggered when key is released
   * @param {float} millis The time in millis this key was released
   */
  triggerKeyup(millis:number) {
    //ERRORR
    if (this.#allowOverlap || this.#isPressed) { //this line is bugged because the keymap is switched to true before this happens
      this.#isPressed = false;
      this.#keyupTime = millis;
      this.#keyupEvents.forEach(event => event());
    }
  }
  // true if the key is pressed
  get isPressed() {
    return this.#isPressed;
  }
  // last time this key was pressed
  get keydownTime() {
    return this.#keydownTime;
  }
  // last time this key was released
  get keyupTime() {
    return this.#keyupTime;
  }
}

// global singleton instance
export let inputManager : InputManager;
type ContextMapType = Record<ContextEnumType, Record<string, InputAction>>;
// call this function to initialize the input manager and set up default keybinds
export function initInputManager() {
  if (inputManager) {
    logError("InputManager instance already exists");
    return inputManager;
  }
  inputManager = new InputManager();
  inputManager.setContextMap({
    [ContextEnum.GAME]: {
      up: new InputAction(["KeyW", "ArrowUp"]),
      down: new InputAction(["KeyS", "ArrowDown"]),
      left: new InputAction(["KeyA", "ArrowLeft"]),
      right: new InputAction(["KeyD", "ArrowRight"]),
      dash: new InputAction(["Space"]),
    }
  });
  inputManager.setContextMap()
  window.onkeydown = inputManager.onkeydown;
  window.onkeyup = inputManager.onkeyup;
  window.onblur = inputManager.onblur;
}

// InputManager singleton
class InputManager {
  #keyMap:Record<string, InputAction[]> = {}; // maps keycode strings to InputAction objects. Ex: "KeyW" --> [InputAction for "up"]
  #contextMap:ContextMapType = {}; // maps context names to action maps. Ex: "game" --> {"up": InputAction for "up", "down": InputAction for "down", ...}
  
  setContextMap(contextMap:ContextMapType = this.#contextMap) {
    this.#contextMap = contextMap;
  }
  /**
   * Get the action from the context map or null if not found
   * @param context name of context, e.g. "game", "ui", "rebind"
   * @param actionName name of action, e.g. "up", "down", "left", "right"
   * @returns the InputAction object corresponding to the context and action name
   * @throws Error if context or action name is not found
   */
  getAction(context:ContextEnumType, actionName:string):InputAction | null {
    const contextResult = this.#contextMap[context];
    if (!contextResult) {
      logError(`Context ${context} not found in context map`);
      return null;
    }
    const action = contextResult[actionName] || null;
    if (!action) {
      logError(`Action ${actionName} not found in context ${context}`);
    }
    return action;
  }
  // event for window.onkeydown
  onkeydown = (keyevent:KeyboardEvent) => {
    let keyMapInstances = this.#keyMap[keyevent.code]
    if (keyMapInstances) {
      keyMapInstances.forEach(action => action.triggerKeydown(gameManager.ticker.lastTime));
    }
  }
  // event for window.onkeyup
  onkeyup = (keyevent:KeyboardEvent) => {
    let keyMapInstances = this.#keyMap[keyevent.code]
    if (keyMapInstances) {
      keyMapInstances.forEach(action => action.triggerKeyup(gameManager.ticker.lastTime));
    }
  }
  // event for window.blur
  onblur = () => {
    //when window blurs, deactivate all inputs
    for (let inputAction of Object.values(this.#keyMap)) {
      inputAction.forEach(action => {
        if (action.isPressed) {
          action.triggerKeyup(gameManager.ticker.lastTime);
        }
      });
    }
  }
  // maps keycode strings to InputAction objects. Ex: "KeyW" --> [InputAction for "up"]
  get keyMap() {
    return this.#keyMap;
  }
  // maps context names to action maps. Ex: "game" --> {"up": InputAction for "up", "down": InputAction for "down", ...}
  get contextMap() {
    return this.#contextMap;
  }
}