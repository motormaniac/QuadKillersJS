import { PixiRootComponent } from "./PixiRoot";
import { Component } from "../GameObject";
import { gameManager } from "../GameManager";
import { Vec } from "../Vector";
import { logError } from "../Error";

export class PhysicsComponent extends Component {
  // vector2Ds are not referenceable (treat them as immutables)
  position: Vec;
  velocity: Vec;
  acceleration: Vec;

  /** All values are (0,0) by default */
  constructor(pos:Vec=Vec.ZERO, vel:Vec=Vec.ZERO, acc:Vec=Vec.ZERO) {
    super();
    this.position = pos;
    this.velocity = vel;
    this.acceleration = acc;
  }
  init(): void {
    const root = this.gameObject.getComponent(PixiRootComponent);
    if (!root) {
      logError("PhysicsComponent requires a PixiRootComponent to function properly");
      return;
    }
  }
  /**
   * Physics update is called externally before the regular update loop.
   */
  physicsUpdate(): void {
    this.velocity = this.velocity.add(this.acceleration.mul(gameManager.ticker.deltaTime));
    this.position = this.position.add(this.velocity.mul(gameManager.ticker.deltaTime));
  }
}