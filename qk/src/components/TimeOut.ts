import { gameManager } from "../GameManager";
import { Component } from "../GameObject";

/** Destroys this GameObject after a specified time */
export class TimeOutComponent extends Component {
  #timeLimit: number;
  #elapsed: number = 0;
  constructor(time: number) {
    super();
    this.#timeLimit = time;
  }

  update() {
    this.#elapsed += gameManager.ticker.deltaTime;
    if (this.#elapsed >= this.#timeLimit) {
      // destroy the component after the timeout is reached
      this.gameObject.destroy();
    }
  }
}