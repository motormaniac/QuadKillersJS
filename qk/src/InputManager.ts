import { gameManager } from "./GameManager";

/**
 * This system is used for handling input from keyboard. To handle mouse input, see pixi Event Handlers
 */

export const ContextEnum = {
  GAME: "game",
  REBIND: "rebind",
  UI:"ui",
};
type ContextEnumType = typeof ContextEnum[keyof typeof ContextEnum];

/**
 * Class representing an action that can be binded to multiple keybinds
 */
export class InputAction {
  #isPressed:boolean = false;
  #keydownTime:number = 0;
  #keyupTime:number = 0;
  #keydownEvents:Function[] = [];
  #keyupEvents:Function[] = [];

  /**
   * If true, keydown/keyup events will trigger even if key is already down.
   * E.g. if both "KeyW" and "ArrowUp" are hotkeys, pressing W while holding ArrowUp will trigger keydown event again
   */
  #allowOverlap = false;

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
   * @param {Function} event Function to call when key is pressed
   */
  onKeydown(event:Function) {
    this.#keydownEvents.push(event);
  }
  /**
   * Adds a function to be called when this key is released
   * @param {Function} event Function to call when key is released
   */
  onKeyup(event:Function) {
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
  // readonly
  get isPressed() {
    return this.#isPressed;
  }
  get keydownTime() {
    return this.#keydownTime;
  }
  get keyupTime() {
    return this.#keyupTime;
  }
}

export let inputManager : InputManager;
type ContextMapType = Record<ContextEnumType, Record<string, InputAction>>;
export function initInputManager() {
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

class InputManager {
  #keyMap:Record<string, InputAction[]> = {};
  #contextMap:ContextMapType = {};
  
  constructor() {
    if (inputManager) {
      throw new Error("InputManager instance already exists");
    }
  }
  setContextMap(contextMap:ContextMapType = this.#contextMap) {
    this.#contextMap = contextMap;
  }
  /**
   * Get the action from the context map. Throws an error if the action is not found
   * @param context name of context, e.g. "game", "ui", "rebind"
   * @param actionName name of action, e.g. "up", "down", "left", "right"
   * @returns the InputAction object corresponding to the context and action name
   * @throws Error if context or action name is not found
   */
  getAction(context:ContextEnumType, actionName:string):InputAction {
    let action =this.#contextMap[context][actionName];
    if (!action) {
      throw new Error(`Action ${actionName} not found in context ${context}`);
    }
    return action;
  }
  onkeydown = (keyevent:KeyboardEvent) => {
    let keyMapInstances = this.#keyMap[keyevent.code]
    if (keyMapInstances) {
      keyMapInstances.forEach(action => action.triggerKeydown(gameManager.lastTime));
    }
  }
  
  onkeyup = (keyevent:KeyboardEvent) => {
    let keyMapInstances = this.#keyMap[keyevent.code]
    if (keyMapInstances) {
      keyMapInstances.forEach(action => action.triggerKeyup(gameManager.lastTime));
    }
  }
  
  onblur = () => {
    //when window blurs, deactivate all inputs
    for (let inputAction of Object.values(this.#keyMap)) {
      inputAction.forEach(action => {
        if (action.isPressed) {
          action.triggerKeyup(gameManager.lastTime);
        }
      });
    }
  }
  get keyMap() {
    return this.#keyMap;
  }
  get contextMap() {
    return this.#contextMap;
  }
}