import type { Collider } from "../CollisionLibrary";
import { Component } from "../GameObject";
import { Vec } from "../Vector";
import { PhysicsComponent } from "./Physics";

export class ColliderComponent extends Component {
  #collider: Collider;
  #collideEvents: ((other: ColliderComponent) => void)[] = [];
  #lastPosition: Vec = Vec.ZERO; // used to track the motion of gameobject
  // layers / categories that this collider falls under. Ex: "player", "enemy", "bullet"
  collideLabels: Set<string>;

  /**
   * @param collider make sure the Collider is created in LOCAL coordinates relative the gameobject's position
   */
  constructor(collider: Collider, collideLabels: Set<string> = new Set("default")) {
    super();
    this.#collider = collider;
    this.collideLabels = collideLabels;
  }
  get collider() {
    return this.#collider;
  }
  init(): void {
    const physics = this.gameObject.getComponent(PhysicsComponent);
    if (physics) {
      // initialize last position to current position
      this.#lastPosition = physics.position;
    }
  }
  update() {
    const physics = this.gameObject.getComponent(PhysicsComponent);
    if (physics) {
      this.#collider = this.#collider.translate(physics.position.sub(this.#lastPosition));
      this.#lastPosition = physics.position;
    }
  }
  onCollide(callback: (other: ColliderComponent) => void) {
    this.#collideEvents.push(callback);
  }
  triggerCollide(other: ColliderComponent) {
    this.#collideEvents.forEach((callback) => callback(other));
  }
}