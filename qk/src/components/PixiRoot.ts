import { Container } from "pixi.js";
import { Component } from "../GameObject";
import { PhysicsComponent } from "./Physics";

export class PixiRootComponent extends Component {
  #container: Container;
  constructor() {
    super();
    this.#container = new Container();
  }
  get container() {
    return this.#container;
  }
  init(): void {
    this.gameObject.onDestroy(() => {
      this.#container.destroy({ children: true });
    });
  }
  update(): void {
    const physics = this.gameObject.getComponent(PhysicsComponent);
    if (physics) {
      this.#container.position.set(physics.position.x, physics.position.y);
    }
  }
}
