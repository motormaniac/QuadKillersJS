import type { Container } from "pixi.js";
import { PixiRootComponent } from "./PixiRoot";
import { Component, GameObject } from "../GameObject";
import { gameManager } from "../GameManager";
import { Vec } from "../Vector";

export class PhysicsComponent extends Component {
  // vector2Ds are not referenceable
  position: Vec;
  velocity: Vec;
  acceleration: Vec;
  mass: number = 1;
  #rootContainer!:Container;

  constructor(pos:Vec=Vec.ZERO, vel:Vec=Vec.ZERO, acc:Vec=Vec.ZERO) {
    super();
    this.position = pos;
    this.velocity = vel;
    this.acceleration = acc;
  }
  init(gameObject: GameObject): void {
    this.#rootContainer = gameObject.getComponent(PixiRootComponent).container;
  }
  update(_gameObject: GameObject): void {
    this.velocity = this.velocity.add(this.acceleration.mul(gameManager.deltaTime));
    this.position = this.position.add(this.velocity.mul(gameManager.deltaTime));
    
    // update pixi position
    this.#rootContainer.x = this.position.x;
    this.#rootContainer.y = this.position.y;
  }
  /**
   * Force applied
   * @param impulseX
   * @param impulseY
   */
  applyImpulse(impulse:Vec) {
    this.velocity = this.velocity.add(impulse.div(this.mass));
  }
  applyForce(force: Vec) {
    this.velocity = this.velocity.add(force.mul(gameManager.deltaTime).div(this.mass));
  }
}