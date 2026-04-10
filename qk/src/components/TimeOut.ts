import { gameManager } from "../GameManager";
import { Component, type GameObject } from "../GameObject";

export class TimeOutComponent extends Component {
  #timeLimit: number;
  #elapsed: number = 0;
  #callback: Function;
  constructor(time: number, callback: Function) {
    super();
    this.#timeLimit = time;
    this.#callback = callback;
  }

  update(gameObject: GameObject) {
    this.#elapsed += gameManager.deltaTime;
    if (this.#elapsed >= this.#timeLimit) {
      this.#callback();
      // destroy the component after the timeout is reached
      gameObject.destroy();
    }
  }
}